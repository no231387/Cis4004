const express = require('express');
const {
  getFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  updateProficiency
} = require('../controllers/flashcardController');

const router = express.Router();

router.route('/').get(getFlashcards).post(createFlashcard);
router.route('/:id').get(getFlashcardById).put(updateFlashcard).delete(deleteFlashcard);
router.patch('/:id/proficiency', updateProficiency);

module.exports = router;
