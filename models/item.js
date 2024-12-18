const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "名前を入力してください"],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: [true, "カテゴリ名を入力してください"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Itemの個数に最小値(0)より小さな値を指定することはできません"]
  },
  threshold: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model('Item', itemSchema);