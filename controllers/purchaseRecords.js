const mongoose = require("mongoose");
const PurchaseRecord = require("../models/purchaseRecord");
const Item = require("../models/item");

const getAllRawPurchaseRecords = async (req, res) => {
    try {
        const rawRecords = await PurchaseRecord.find({});
        res.status(200).json(rawRecords);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllPurchaseRecords = async (req, res) => {
    try {
        const populatedRecords = await PurchaseRecord.find({})
        .sort({ purchasedDate: 'desc'})
        .populate("item", "name")
        .exec();

        res.status(200).json(populatedRecords);
    } catch (err) {
        res.status(500).json(err);
    }
};

const createPurchaseRecord = async (req, res) => {

    let createdPurchaseRecord = null;
    // use transaction for modifying multiple data
    const createHistoryAndIncreaseItemQty = async (requestBody) => {
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                createdPurchaseRecord = await PurchaseRecord.create([requestBody], { session });
                console.log(`record: ${createdPurchaseRecord}`)

                const updateItem= await Item.findByIdAndUpdate(
                    requestBody.item,
                    { quantity: requestBody.quantityRemaining },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
                console.log(`item: ${updateItem}`);
                if (!updateItem) {
                    await session.abortTransaction();
                    throw `specified id:${requestBody.item} not found.`;
                }
            })

            await session.commitTransaction();
        } catch (error) {
            console.error("error has occured during transaction.");
            // await session.abortTransaction(); // 現在は不要？
            throw error;
        } finally {
            session.endSession();
        }
    }

    try {
        console.log("===== creating new purchase record... =====");
        await createHistoryAndIncreaseItemQty(req.body);
        res.status(200).json(...createdPurchaseRecord);
        console.log("===== create record and increase item qty succeeded. =====");
    } catch (err){
        console.error(err);
        res.status(500).json(err);
        console.log("===== create record and increase item qty failed. =====");
    }
};

const updatePurchaseRecord = async (req, res) => {
    try {
        const updatePurchaseRecord = await PurchaseRecord.findOneAndUpdate(
            { _id: req.params.id }, 
            req.body,
            { new: true }
        );
        if(!updatePurchaseRecord) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(updatePurchaseRecord);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deletePurchaseRecord = async (req, res) => {
    try {
        const deletePurchaseRecord = await PurchaseRecord.findOneAndDelete({ _id: req.params.id });
        if(!deletePurchaseRecord) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(deletePurchaseRecord);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getAllPurchaseRecords,
    createPurchaseRecord,
    updatePurchaseRecord,
    deletePurchaseRecord,
    getAllRawPurchaseRecords
};
