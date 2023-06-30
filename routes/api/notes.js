const express = require('express')
const router = express.Router()
const notesCtrl = require('../../controllers/api/notes')


router.get('/', notesCtrl.index)
router.get('/', notesCtrl.show)
router.post('/', notesCtrl.create)
router.patch('/', notesCtrl.update)
router.delete('/', notesCtrl.noteDelete)

module.exports = router
