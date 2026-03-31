import { useEffect, useMemo, useState } from 'react';
import { getFlashcards, updateProficiency } from '../services/flashcardService';

function StudySessionPage() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const { data } = await getFlashcards();
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
    if (!currentCard) return;

    try {
      const { data } = await updateProficiency(currentCard._id, rating);
      setCards((previous) => previous.map((card) => (card._id === currentCard._id ? data : card)));
      nextCard();
    } catch (error) {
      console.error('Failed to update proficiency:', error);
    }
  };

  if (cards.length === 0) {
    return (
      <section>
        <h2>Study Session</h2>
        <p>Add flashcards first, then come back to study.</p>
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
            <div className="rating-row">
              <p>How well did you know this card?</p>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button type="button" key={rating} onClick={() => handleRating(rating)}>
                  {rating}
                </button>
              ))}
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setShowAnswer(true)}>
            Reveal Translation
          </button>
        )}
      </article>

      <button type="button" onClick={nextCard} className="secondary-button">
        Skip to Next Card
      </button>
    </section>
  );
}

export default StudySessionPage;
