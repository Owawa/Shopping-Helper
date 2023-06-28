const PurchaseRecord = require("../models/purchaseRecord");

const getAllPurchaseRecords = async (req, res) => {
    try {
        const allPurchaseRecords = await PurchaseRecord.find({});
        res.status(200).json(allPurchaseRecords);
    } catch (err) {
        res.status(500).json(err);
    }
};

const createPurchaseRecord = async (req, res) => {
    // If not specified, default date value is set to be current time
    if(!req.body.purchasedDate) {
        req.body.purchasedDate = new Date(); 
    }

    try {
        // model.create require 1 arg as obj like => {name: hoge}
        const createPurchaseRecord = await PurchaseRecord.create(req.body);
        res.status(200).json(createPurchaseRecord);
    } catch (err) {
        res.status(500).json(err);
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
    deletePurchaseRecord
};