import { useNavigate } from 'react-router-dom';
import FlashcardForm from '../components/FlashcardForm';
import { createFlashcard } from '../services/flashcardService';

function AddFlashcardPage() {
  const navigate = useNavigate();

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
      <FlashcardForm onSubmit={handleCreate} submitLabel="Create Flashcard" />
    </section>
  );
}

export default AddFlashcardPage;
