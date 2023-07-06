const Item = require("../models/item");

const getAllItems = async (req, res) => {
    try {
        const allItem = await Item.find({});
        // console.log(`found item data is: ${allItem}`);
        res.status(200).json(allItem);
    } catch (err) {
        res.status(500).json(err);
    }
};

const createItem = async (req, res) => {
    // model.create require 1 arg as obj like => {name: hoge}
    try {
        const createItem = await Item.create(req.body);
        res.status(200).json(createItem);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteItem = async (req, res) => {
    try {
        const deleteItem = await Item.findOneAndDelete({ _id: req.params.id });
        if(!deleteItem) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(deleteItem);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSingleItem = async (req, res) => {
    try {
        const singleItem = await Item.findOne({ _id: req.params.id });
        if(!singleItem) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(singleItem);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateItem = async (req, res) => {
    try {
        const updateItem = await Item.findOneAndUpdate(
            { _id: req.params.id }, 
            req.body,
            { 
                new: true,
                runValidators: true
            }
        );
        if(!updateItem) {
            return res.status(404).json(`_id:${req.params.id}は存在しません`);
        }
        res.status(200).json(updateItem);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getAllItems,
    createItem,
    deleteItem,
    getSingleItem,
    updateItem
};