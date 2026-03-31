const express = require('express');
const {
  getFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  updateProficiency,
  reviewFlashcard,
  getDashboardStats,
  bulkImportFlashcards
} = require('../controllers/flashcardController');

const router = express.Router();

router.get('/stats', getDashboardStats);
router.post('/import', bulkImportFlashcards);
router.route('/').get(getFlashcards).post(createFlashcard);
router.route('/:id').get(getFlashcardById).put(updateFlashcard).delete(deleteFlashcard);
router.patch('/:id/proficiency', updateProficiency);
router.patch('/:id/review', reviewFlashcard);

module.exports = router;
