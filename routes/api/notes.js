const express = require('express');
const router = express.Router();
const notesCtrl = require('../../controllers/api/notes');
const auth = require('../../config/auth'); // Adjust the path as necessary

// Use the middleware
router.use(auth);

// At the beginning of each route handler in routes/api/notes.js
router.get('/:id', (req, res) => {
    console.log(`Received request for note with ID: ${req.params.id}`);
    notesCtrl.show(req, res);
  });
  
router.patch('/:id', notesCtrl.update);
router.delete('/:id', notesCtrl.noteDelete);
router.post('/', notesCtrl.create);
router.get('/', notesCtrl.index);

module.exports = router;
