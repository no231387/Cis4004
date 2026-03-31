import { useState } from 'react';

const defaultState = {
  wordOrPhrase: '',
  translation: '',
  language: '',
  category: '',
  exampleSentence: '',
  proficiency: 1
};

function FlashcardForm({ initialData, onSubmit, submitLabel = 'Save Flashcard' }) {
  const [formData, setFormData] = useState(initialData || defaultState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: name === 'proficiency' ? Number(value) : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <label>
        Word or Phrase
        <input name="wordOrPhrase" value={formData.wordOrPhrase} onChange={handleChange} required />
      </label>

      <label>
        Translation
        <input name="translation" value={formData.translation} onChange={handleChange} required />
      </label>

      <label>
        Language
        <input name="language" value={formData.language} onChange={handleChange} required />
      </label>

      <label>
        Category / Topic
        <input name="category" value={formData.category} onChange={handleChange} />
      </label>

      <label>
        Example Sentence
        <textarea name="exampleSentence" value={formData.exampleSentence} onChange={handleChange} rows="3" />
      </label>

      <label>
        Proficiency Level (1-5)
        <select name="proficiency" value={formData.proficiency} onChange={handleChange}>
          <option value={1}>1 - New</option>
          <option value={2}>2 - Learning</option>
          <option value={3}>3 - Familiar</option>
          <option value={4}>4 - Strong</option>
          <option value={5}>5 - Mastered</option>
        </select>
      </label>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default FlashcardForm;
