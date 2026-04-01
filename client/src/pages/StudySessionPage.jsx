import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createStudySession, getFlashcards, reviewFlashcard } from '../services/flashcardService';

function StudySessionPage() {
  const [searchParams] = useSearchParams();
  const selectedDeckId = searchParams.get('deck') || '';
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    startedAt: new Date().toISOString(),
    reviewedFlashcards: [],
    againCount: 0,
    goodCount: 0,
    easyCount: 0
  });
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const { data } = await getFlashcards(selectedDeckId ? { deck: selectedDeckId } : {});
        setCards(data);
      } catch (error) {
        console.error('Failed to load study cards:', error);
      }
    };

    loadCards();
  }, [selectedDeckId]);

  useEffect(() => {
    const saveCompletedSession = async () => {
      if (cards.length !== 0 || sessionSaved || sessionStats.reviewedFlashcards.length === 0) {
        return;
      }

      try {
        await createStudySession({
          flashcards: sessionStats.reviewedFlashcards,
          reviewedCount: sessionStats.reviewedFlashcards.length,
          againCount: sessionStats.againCount,
          goodCount: sessionStats.goodCount,
          easyCount: sessionStats.easyCount,
          startedAt: sessionStats.startedAt,
          completedAt: new Date().toISOString()
        });
        setSessionSaved(true);
      } catch (error) {
        console.error('Failed to save study session:', error);
      }
    };

    saveCompletedSession();
  }, [cards.length, sessionSaved, sessionStats]);

  const currentCard = useMemo(() => cards[currentIndex], [cards, currentIndex]);

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (cards.length === 0 ? 0 : (prev + 1) % cards.length));
  };

  const handleRating = async (rating) => {
    if (!currentCard || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await reviewFlashcard(currentCard._id, rating);
      setSessionStats((previous) => ({
        ...previous,
        reviewedFlashcards: previous.reviewedFlashcards.includes(currentCard._id)
          ? previous.reviewedFlashcards
          : [...previous.reviewedFlashcards, currentCard._id],
        againCount: previous.againCount + (rating === 'again' ? 1 : 0),
        goodCount: previous.goodCount + (rating === 'good' ? 1 : 0),
        easyCount: previous.easyCount + (rating === 'easy' ? 1 : 0)
      }));
      const nextLength = cards.length - 1;
      setCards((previous) => previous.filter((card) => card._id !== currentCard._id));
      setCurrentIndex((previous) => {
        if (nextLength <= 0) return 0;
        return previous >= nextLength ? 0 : previous;
      });
      setShowAnswer(false);
    } catch (error) {
      console.error('Failed to review flashcard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cards.length === 0) {
    return (
      <section className="page-section">
        <h2>Study Session</h2>
        <p>{selectedDeckId ? 'No flashcards found in this deck yet.' : 'No flashcards available right now. Add new flashcards to start studying.'}</p>
        {sessionSaved && <p>Your latest study session was saved.</p>}
      </section>
    );
  }

  return (
    <section className="page-section">
      <h2>Study Session</h2>
      <article className="card study-card study-card-large">
        <div className="study-card-content">
          <h3>{currentCard.wordOrPhrase}</h3>
          <p className="study-card-meta">
          <strong>Language:</strong> {currentCard.language}
          </p>

          {showAnswer ? (
            <>
              <p className="study-card-answer">
                <strong>Translation:</strong> {currentCard.translation}
              </p>
              <p className="study-card-meta">
                <strong>Example:</strong> {currentCard.exampleSentence || 'No example provided'}
              </p>
              <p className="study-card-meta">
                <strong>Proficiency:</strong> {currentCard.proficiency}
              </p>
              <div className="rating-row">
                <p>How did this review feel?</p>
                <button type="button" onClick={() => handleRating('again')} disabled={isSubmitting} className="danger-button">
                  Again
                </button>
                <button type="button" onClick={() => handleRating('good')} disabled={isSubmitting}>
                  Good (+1 Proficiency)
                </button>
                <button type="button" onClick={() => handleRating('easy')} disabled={isSubmitting} className="easy-button">
                  Easy (+2 Proficiency)
                </button>
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setShowAnswer(true)}>
              Reveal Translation
            </button>
          )}
        </div>
      </article>

      <div className="study-footer-actions">
        <button type="button" onClick={nextCard} className="secondary-button">
          Skip Card
        </button>
      </div>
    </section>
  );
}

export default StudySessionPage;
