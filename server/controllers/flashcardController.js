const Flashcard = require('../models/Flashcard');

const MIN_EASE_FACTOR = 1.3;
const REVIEW_RATINGS = new Set(['again', 'good', 'easy']);
const DUPLICATE_OPTIONS = new Set(['skip', 'import_anyway', 'update_existing']);

const getStartOfTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

const getDueFilter = (cutoffDate = new Date()) => ({
  $or: [
    { reviewCount: 0 },
    { nextReviewDate: null },
    { nextReviewDate: { $lte: cutoffDate } }
  ]
});

const calculateNextReviewDate = (daysUntilReview) => {
  const nextReviewDate = new Date();
  nextReviewDate.setHours(0, 0, 0, 0);
  nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilReview);
  return nextReviewDate;
};

const updateProficiencyFromReview = (currentProficiency, rating) => {
  if (rating === 'again') {
    return Math.max(1, currentProficiency - 1);
  }

  if (rating === 'easy') {
    return Math.min(5, currentProficiency + 2);
  }

  return Math.min(5, currentProficiency + 1);
};

const applyReviewRating = (flashcard, rating) => {
  let interval = flashcard.interval || 0;
  let easeFactor = flashcard.easeFactor || 2.5;
  const reviewCount = flashcard.reviewCount || 0;

  if (rating === 'again') {
    interval = 1;
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
  } else if (rating === 'good') {
    interval = interval <= 0 ? 1 : Math.max(1, Math.round(interval * easeFactor));
  } else {
    interval = interval <= 0 ? 3 : Math.max(interval + 1, Math.round(interval * (easeFactor + 0.15)));
    easeFactor += 0.15;
  }

  flashcard.interval = interval;
  flashcard.easeFactor = Number(easeFactor.toFixed(2));
  flashcard.reviewCount = reviewCount + 1;
  flashcard.nextReviewDate = calculateNextReviewDate(interval);
  flashcard.proficiency = updateProficiencyFromReview(flashcard.proficiency, rating);
};

const buildFilters = ({ language, category, proficiency, due }) => {
  const filters = {};

  if (language) filters.language = language;
  if (category) filters.category = category;
  if (proficiency) filters.proficiency = Number(proficiency);
  if (due === 'true') filters.$and = [getDueFilter()];

  return filters;
};

const normalizeText = (value) => String(value || '').trim();

const parseProficiency = (value) => {
  if (value === '' || value === null || value === undefined) {
    return { value: 1 };
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    return { error: 'Proficiency must be a whole number from 1 to 5.' };
  }

  return { value: parsed };
};

const createDuplicateKey = ({ wordOrPhrase, translation, language }) =>
  [wordOrPhrase, translation, language].map((value) => normalizeText(value).toLowerCase()).join('::');

const buildImportPayload = (row) => {
  const wordOrPhrase = normalizeText(row.question);
  const translation = normalizeText(row.answer);
  const language = normalizeText(row.language) || 'Unspecified';
  const category = normalizeText(row.deck) || 'General';
  const proficiencyResult = parseProficiency(row.proficiency);
  const errors = [];

  if (!wordOrPhrase) errors.push('Question is required.');
  if (!translation) errors.push('Answer is required.');
  if (proficiencyResult.error) errors.push(proficiencyResult.error);

  const payload = {
    wordOrPhrase,
    translation,
    language,
    category,
    proficiency: proficiencyResult.value ?? 1
  };

  const validationError = new Flashcard(payload).validateSync();

  if (validationError) {
    errors.push(...Object.values(validationError.errors).map((error) => error.message));
  }

  return {
    payload,
    errors: [...new Set(errors)]
  };
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

exports.reviewFlashcard = async (req, res) => {
  try {
    const rating = String(req.body.rating || '').toLowerCase();

    if (!REVIEW_RATINGS.has(rating)) {
      return res.status(400).json({ message: 'Rating must be one of: again, good, easy.' });
    }

    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found.' });
    }

    applyReviewRating(flashcard, rating);

    await flashcard.save();
    res.status(200).json(flashcard);
  } catch (error) {
    res.status(400).json({ message: 'Failed to review flashcard.', error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [total, mastered, newCards, dueToday] = await Promise.all([
      Flashcard.countDocuments(),
      Flashcard.countDocuments({ proficiency: 5 }),
      Flashcard.countDocuments({ proficiency: 1 }),
      Flashcard.countDocuments(getDueFilter(getStartOfTomorrow()))
    ]);

    res.status(200).json({
      total,
      mastered,
      newCards,
      dueToday
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard stats.', error: error.message });
  }
};

exports.bulkImportFlashcards = async (req, res) => {
  try {
    const rows = Array.isArray(req.body.rows) ? req.body.rows : [];
    const duplicateHandling = String(req.body.duplicateHandling || 'skip').toLowerCase();

    if (!DUPLICATE_OPTIONS.has(duplicateHandling)) {
      return res.status(400).json({
        message: 'Duplicate handling must be one of: skip, import_anyway, update_existing.'
      });
    }

    const existingCards = await Flashcard.find({}, 'wordOrPhrase translation language category proficiency');
    const existingMap = new Map(existingCards.map((card) => [createDuplicateKey(card), card]));

    const summary = {
      totalRows: rows.length,
      insertedRows: 0,
      invalidRows: 0,
      duplicateRows: 0,
      updatedRows: 0,
      results: []
    };

    for (const [index, row] of rows.entries()) {
      const rowNumber = Number(row.rowNumber) || index + 1;
      const { payload, errors } = buildImportPayload(row);

      if (errors.length > 0) {
        summary.invalidRows += 1;
        summary.results.push({
          rowNumber,
          status: 'invalid',
          errors
        });
        continue;
      }

      const duplicateKey = createDuplicateKey(payload);
      const existingCard = existingMap.get(duplicateKey);

      if (existingCard) {
        summary.duplicateRows += 1;

        if (duplicateHandling === 'skip') {
          summary.results.push({
            rowNumber,
            status: 'duplicate_skipped',
            errors: ['Duplicate flashcard skipped.']
          });
          continue;
        }

        if (duplicateHandling === 'update_existing') {
          existingCard.wordOrPhrase = payload.wordOrPhrase;
          existingCard.translation = payload.translation;
          existingCard.language = payload.language;
          existingCard.category = payload.category;
          existingCard.proficiency = payload.proficiency;

          await existingCard.save();

          summary.updatedRows += 1;
          summary.results.push({
            rowNumber,
            status: 'updated',
            errors: []
          });
          continue;
        }
      }

      const flashcard = await Flashcard.create(payload);

      if (!existingMap.has(duplicateKey)) {
        existingMap.set(duplicateKey, flashcard);
      }

      summary.insertedRows += 1;
      summary.results.push({
        rowNumber,
        status: existingCard ? 'duplicate_imported' : 'inserted',
        errors: []
      });
    }

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to import flashcards.', error: error.message });
  }
};
