import { useEffect, useMemo, useState } from 'react';
import { getFlashcards, reviewFlashcard } from '../services/flashcardService';

function StudySessionPage() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const { data } = await getFlashcards({ due: true });
        setCards(data);
      } catch (error) {
        console.error('Failed to load study cards:', error);
      }
    };

    loadCards();
  }, []);

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
      <section>
        <h2>Study Session</h2>
        <p>No cards are due right now. Add new flashcards or come back when more reviews are scheduled.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Study Session</h2>
      <article className="card study-card">
        <h3>{currentCard.wordOrPhrase}</h3>
        <p>
          <strong>Language:</strong> {currentCard.language}
        </p>

        {showAnswer ? (
          <>
            <p>
              <strong>Translation:</strong> {currentCard.translation}
            </p>
            <p>
              <strong>Example:</strong> {currentCard.exampleSentence || 'No example provided'}
            </p>
            <p>
              <strong>Proficiency:</strong> {currentCard.proficiency}
            </p>
            <div className="rating-row">
              <p>How did this review feel?</p>
              <button type="button" onClick={() => handleRating('again')} disabled={isSubmitting} className="danger-button">
                Again
              </button>
              <button type="button" onClick={() => handleRating('good')} disabled={isSubmitting}>
                Good
              </button>
              <button type="button" onClick={() => handleRating('easy')} disabled={isSubmitting} className="easy-button">
                Easy
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setShowAnswer(true)}>
            Reveal Translation
          </button>
        )}
      </article>

      <button type="button" onClick={nextCard} className="secondary-button">
        Skip Due Card
      </button>
    </section>
  );
}

export default StudySessionPage;
