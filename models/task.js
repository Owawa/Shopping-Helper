const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
   name: {
        type: String,
        required: [true, "タスク名を入れてください"],
        trim: true,
        maxlength: [20, "タスク名は、20文字以内で入力してください"]
   },
   completed: {
    type: Boolean,
    default: false
   }
});
module.exports = mongoose.model("Task", taskSchema);