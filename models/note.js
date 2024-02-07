const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Comment schema
const commentSchema = new Schema({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Include comments in the Note schema using the Comment schema
const noteSchema = new Schema({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema] // Embedding comments directly into notes
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
