import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FlashcardForm from '../components/FlashcardForm';
import { getFlashcard, updateFlashcard } from '../services/flashcardService';

function EditFlashcardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const { data } = await getFlashcard(id);
        setCard(data);
      } catch (error) {
        console.error('Failed to load flashcard:', error);
      }
    };

    loadCard();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateFlashcard(id, formData);
      navigate('/flashcards');
    } catch (error) {
      console.error('Failed to update flashcard:', error);
      alert('Could not update flashcard.');
    }
  };

  return (
    <section>
      <h2>Edit Flashcard</h2>
      {card ? <FlashcardForm initialData={card} onSubmit={handleUpdate} submitLabel="Update Flashcard" /> : <p>Loading...</p>}
    </section>
  );
}

export default EditFlashcardPage;
