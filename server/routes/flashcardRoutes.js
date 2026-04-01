const express = require('express');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
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

router.use(protect);

router.get('/stats', getDashboardStats);
router.post('/import', requireAdmin, bulkImportFlashcards);
router.route('/').get(getFlashcards).post(requireAdmin, createFlashcard);
router.route('/:id').get(getFlashcardById).put(requireAdmin, updateFlashcard).delete(requireAdmin, deleteFlashcard);
router.patch('/:id/proficiency', updateProficiency);
router.patch('/:id/review', reviewFlashcard);

module.exports = router;
