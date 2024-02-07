const Note = require('../../models/note'); // Adjust the path as necessary

// Post a new note
async function create(req, res) {
    req.body.user = req.user._id;
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Get all notes
async function index(req, res) {
    try {
        const notes = await Note.find({}).populate('user').populate('comments.user');
        res.status(200).json(notes);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Get a single note
async function show(req, res) {
    try {
        const note = await Note.findById(req.params.id).populate('user').populate('comments.user');
        if (!note) return res.status(404).json({error: 'Note not found'});
        res.status(200).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Update a note
async function update(req, res) {
    try {
        const note = await Note.findOneAndUpdate({_id: req.params.id, user: req.user._id}, req.body, {new: true});
        if (!note) return res.status(404).json({error: 'Note not found or user not authorized'});
        res.status(200).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Delete a note
async function remove(req, res) {
    try {
        const note = await Note.findOneAndDelete({_id: req.params.id, user: req.user._id});
        if (!note) return res.status(404).json({error: 'Note not found or user not authorized'});
        res.status(200).json({message: 'Note successfully deleted'});
    } catch (err) {
        res.status(400).json(err);
    }
}

// Add a comment to a note
async function addComment(req, res) {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) return res.status(404).json({error: 'Note not found'});
        note.comments.push({ text: req.body.text, user: req.user._id });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    remove, // 'delete' is a reserved word in JavaScript, so 'remove' is often used
    addComment
};
