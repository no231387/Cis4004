const Flashcard = require('../models/Flashcard');

const buildFilters = ({ language, category, proficiency }) => {
  const filters = {};

  if (language) filters.language = language;
  if (category) filters.category = category;
  if (proficiency) filters.proficiency = Number(proficiency);

  return filters;
};

exports.getFlashcards = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const flashcards = await Flashcard.find(filters).sort({ createdAt: -1 });
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flashcards.', error: error.message });
  }
};

exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found.' });
    }

    res.status(200).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flashcard.', error: error.message });
  }
};

exports.createFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.create(req.body);
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create flashcard.', error: error.message });
  }
};

exports.updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found.' });
    }

    res.status(200).json(flashcard);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update flashcard.', error: error.message });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found.' });
    }

    res.status(200).json({ message: 'Flashcard deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete flashcard.', error: error.message });
  }
};

exports.updateProficiency = async (req, res) => {
  try {
    const { rating } = req.body;
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found.' });
    }

    // Simple beginner-friendly proficiency update formula:
    // New value = rounded average of current proficiency and user rating.
    const safeRating = Math.min(5, Math.max(1, Number(rating)));
    flashcard.proficiency = Math.min(5, Math.max(1, Math.round((flashcard.proficiency + safeRating) / 2)));

    await flashcard.save();
    res.status(200).json(flashcard);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update proficiency.', error: error.message });
  }
};
