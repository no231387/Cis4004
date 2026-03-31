import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import FlashcardListPage from './pages/FlashcardListPage';
import AddFlashcardPage from './pages/AddFlashcardPage';
import EditFlashcardPage from './pages/EditFlashcardPage';
import StudySessionPage from './pages/StudySessionPage';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>LinguaCards</h1>
        <p>Simple language flashcards for vocabulary practice.</p>
      </header>

      <nav className="nav-bar">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/flashcards">Flashcards</NavLink>
        <NavLink to="/add">Add Flashcard</NavLink>
        <NavLink to="/study">Study Session</NavLink>
      </nav>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/flashcards" element={<FlashcardListPage />} />
          <Route path="/add" element={<AddFlashcardPage />} />
          <Route path="/edit/:id" element={<EditFlashcardPage />} />
          <Route path="/study" element={<StudySessionPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
