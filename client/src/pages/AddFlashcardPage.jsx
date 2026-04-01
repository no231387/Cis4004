import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardForm from '../components/FlashcardForm';
import { createFlashcard, getDecks, getOfficialBeginnerDecks } from '../services/flashcardService';
import { useAuth } from '../context/AuthContext';

function AddFlashcardPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const [{ data: standardDecks }, { data: officialDecks }] = await Promise.all([
          getDecks(),
          isAdmin ? getOfficialBeginnerDecks() : Promise.resolve({ data: [] })
        ]);
        setDecks([...standardDecks, ...officialDecks]);
      } catch (error) {
        console.error('Failed to load decks:', error);
      }
    };

    loadDecks();
  }, [isAdmin]);

  const handleCreate = async (formData) => {
    try {
      await createFlashcard(formData);
      navigate('/flashcards');
    } catch (error) {
      console.error('Failed to create flashcard:', error);
      alert('Could not create flashcard. Please check your input.');
    }
  };

  return (
    <section>
      <h2>Add Flashcard</h2>
      <p>{isAdmin ? 'This flashcard can be managed by you as an admin.' : 'This flashcard will be saved under your account.'}</p>
      <FlashcardForm decks={decks} onSubmit={handleCreate} submitLabel="Create Flashcard" />
    </section>
  );
}

export default AddFlashcardPage;
