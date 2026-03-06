const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    labType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Program", ProgramSchema);
