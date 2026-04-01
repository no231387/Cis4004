import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import { deleteFlashcard, getFlashcards, removeDuplicateWords, resetFlashcardProficiency } from '../services/flashcardService';
import { useAuth } from '../context/AuthContext';

const initialFilters = {
  language: '',
  category: '',
  proficiency: ''
};

function FlashcardListPage() {
  const { isAdmin } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  const loadFlashcards = async (activeFilters = filters) => {
    try {
      const query = Object.fromEntries(Object.entries(activeFilters).filter(([, value]) => value !== ''));
      const { data } = await getFlashcards(query);
      setFlashcards(data);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  const handleFilterChange = (event) => {
    const updated = { ...filters, [event.target.name]: event.target.value };
    setFilters(updated);
    loadFlashcards(updated);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    loadFlashcards(initialFilters);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this flashcard?');
    if (!confirmed) return;

    try {
      await deleteFlashcard(id);
      loadFlashcards();
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
    }
  };

  const handleResetProficiency = async (id) => {
    try {
      await resetFlashcardProficiency(id);
      loadFlashcards();
    } catch (error) {
      console.error('Failed to reset flashcard proficiency:', error);
      alert(error.response?.data?.message || 'Could not reset flashcard proficiency.');
    }
  };

  const handleRemoveDuplicates = async () => {
    const confirmed = window.confirm('Remove all duplicate words? The oldest copy of each word will be kept.');
    if (!confirmed) return;

    try {
      const { data } = await removeDuplicateWords();
      alert(`${data.message} Removed: ${data.removedCount}`);
      loadFlashcards();
    } catch (error) {
      console.error('Failed to remove duplicate words:', error);
      alert(error.response?.data?.message || 'Could not remove duplicate words.');
    }
  };

  return (
    <section className="page-section">
      <div className="card hero-card">
        <h2>{isAdmin ? 'All Flashcards' : 'My Flashcards'}</h2>
        <p>Browse, filter, and manage the flashcards available in your current view.</p>
      </div>

      <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      <div className="action-row page-actions">
        <button type="button" onClick={handleRemoveDuplicates} className="secondary-button">
          Remove All Duplicate Words
        </button>
      </div>

      <div className="list-grid">
        {flashcards.map((card) => (
          <article key={card._id} className="card flashcard-card">
            <div className="flashcard-card-header">
              <div>
                <h3>{card.wordOrPhrase}</h3>
                <p className="flashcard-translation">{card.translation}</p>
              </div>
              <span className="mapped-column-tag">Level {card.proficiency}</span>
            </div>

            <div className="flashcard-meta">
              <p>
                <strong>Language:</strong> {card.language}
              </p>
              <p>
                <strong>Deck:</strong> {card.deck?.name || card.category || 'General'}
              </p>
              <p>
                <strong>Review Count:</strong> {card.reviewCount ?? 0}
              </p>
            </div>

            <p>
              <strong>Tags:</strong> {card.tags?.length ? card.tags.map((tag) => tag.name).join(', ') : 'No tags'}
            </p>
            <p className="muted-text">
              <strong>Example:</strong> {card.exampleSentence || 'No example yet'}
            </p>
            {isAdmin && card.owner && (
              <p className="muted-text">
                <strong>Owner:</strong> {card.owner.username}
              </p>
            )}

            <div className="action-row">
              <Link className="button-link" to={`/edit/${card._id}`}>
                Edit
              </Link>
              <button type="button" onClick={() => handleResetProficiency(card._id)} className="secondary-button">
                Reset Proficiency
              </button>
              <button type="button" onClick={() => handleDelete(card._id)} className="danger-button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {flashcards.length === 0 && <p>No flashcards found. Try adding a new one.</p>}
    </section>
  );
}

export default FlashcardListPage;
