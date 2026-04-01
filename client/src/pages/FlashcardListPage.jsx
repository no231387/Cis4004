import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import { deleteFlashcard, getFlashcards } from '../services/flashcardService';
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

  const formatReviewDate = (value) => {
    if (!value) return 'Due now';
    return new Date(value).toLocaleDateString();
  };

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

  return (
    <section>
      <h2>Flashcard List</h2>
      <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      <div className="list-grid">
        {flashcards.map((card) => (
          <article key={card._id} className="card">
            <h3>{card.wordOrPhrase}</h3>
            <p>
              <strong>Translation:</strong> {card.translation}
            </p>
            <p>
              <strong>Language:</strong> {card.language}
            </p>
            <p>
              <strong>Category:</strong> {card.category || 'General'}
            </p>
            <p>
              <strong>Example:</strong> {card.exampleSentence || 'No example yet'}
            </p>
            <p>
              <strong>Proficiency:</strong> {card.proficiency}
            </p>
            <p>
              <strong>Next Review:</strong> {(card.reviewCount ?? 0) === 0 ? 'Due now' : formatReviewDate(card.nextReviewDate)}
            </p>
            <p>
              <strong>Review Count:</strong> {card.reviewCount ?? 0}
            </p>

            {isAdmin && (
              <div className="action-row">
                <Link className="button-link" to={`/edit/${card._id}`}>
                  Edit
                </Link>
                <button type="button" onClick={() => handleDelete(card._id)} className="danger-button">
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {flashcards.length === 0 && <p>No flashcards found. Try adding a new one.</p>}
    </section>
  );
}

export default FlashcardListPage;
