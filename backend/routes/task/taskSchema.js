
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema (
    {
        title: { type: String, required: true, trim: true },
        details: { type: String },
        status: { type: String },
        time: { type: Date },
        userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;