const mongoose = require("mongoose");
const History = require("../models/history");
const Item = require("../models/item");

const getAllRawHistory = async (req, res) => {
    try {
        const rawHistory = await History.find({});
        res.status(200).json(rawHistory);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllPopulatedHistory = async (req, res) => {
    try {
        const populatedHistory = await History.find({})
        .sort({ purchasedDate: 'desc'})
        .populate("item", "name")
        .exec();

        res.status(200).json(populatedHistory);
    } catch (err) {
        res.status(500).json(err);
    }
};

const createHistory = async (req, res) => {

    let createdHistory = null;
    // use transaction for modifying multiple data
    const createHistoryAndIncreaseItemQty = async (requestBody) => {
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                createdHistory = await History.create([requestBody], { session });
                console.log(`history: ${createdHistory}`)

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
        console.log("===== creating new History... =====");
        await createHistoryAndIncreaseItemQty(req.body);
        res.status(200).json(...createdHistory);
        console.log("===== create History and increase item qty succeeded. =====");
    } catch (err){
        console.error(err);
        res.status(500).json(err);
        console.log("===== create History and increase item qty failed. =====");
    }
};

const updateHistory = async (req, res) => {
    try {
        const updateHistory = await History.findOneAndUpdate(
            { _id: req.params.id }, 
            req.body,
            { new: true }
        );
        if(!updateHistory) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(updateHistory);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteHistory = async (req, res) => {
    try {
        const deleteHistory = await History.findOneAndDelete({ _id: req.params.id });
        if(!deleteHistory) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(deleteHistory);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getAllPopulatedHistory,
    createHistory,
    updateHistory,
    deleteHistory,
    getAllRawHistory
};
