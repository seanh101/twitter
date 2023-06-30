const note = require('../../models/note');

function index(req, res) {
    NotesPage.find({ user: req.user._id})
    .then(notes => res.json(notes))
    .catch(err => res.json(error))
}

function show(req, res) {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) throw new Error('No document is found matching that id')
            return note
        })
        .then(note => res.json(note))
        .catch(error => res.json(error))
}

function create(req, res) {
    req.body.user = req.user._id
    console.log(req.body)
    Note.create(req.body)
        .then(note => res.json(note))
        .catch(error => res.json(error))
}

function update(req, res) {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) throw new Error('No document is found matching that id')
            return note
        })
        .then(note => {
            note.text = req.body.text
            return note.save()
        })
        .then(note => res.json(note))
        .catch(error => res.json(error))
}

function noteDelete(req, res) {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) throw new Error('No document is found matching that id')
            return note
        })
        .then(note => {
            return note.deleteOne()
        })
        .then(() => res.json('Note removed'))
        .catch(error => res.json(error))
    }

module.exports = {
    index,
    show,
    create,
    update,
    noteDelete
}