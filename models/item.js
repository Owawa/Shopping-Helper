const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "名前を入力してください"],
    trim: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  threshold: {
    type: Number,
    required: true,
    min: 0,
  },
  lastPurchasedDate: {
    type: Date,
    default: Date.now,
  },
  consumptionRate: { // beta
    type: Number,
    required: false,
    min: 0,
  },
  nextPurchaseDate: { // beta
    type: Date,
    required: false,
  }
});

module.exports = mongoose.model('Item', itemSchema);