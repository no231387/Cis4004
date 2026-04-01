import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import FlashcardListPage from './pages/FlashcardListPage';
import AddFlashcardPage from './pages/AddFlashcardPage';
import DecksPage from './pages/DecksPage';
import EditFlashcardPage from './pages/EditFlashcardPage';
import OfficialBeginnerDecksPage from './pages/OfficialBeginnerDecksPage';
import StudySessionPage from './pages/StudySessionPage';
import ImportFlashcardsPage from './pages/ImportFlashcardsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('linguacards_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('linguacards_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="header-top-row">
            {user ? <span className="welcome-text">Welcome, {user.username}</span> : <span />}
            <button type="button" onClick={toggleTheme} className="theme-toggle secondary-button">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <h1>LinguaCards</h1>
          <p>
          Simple language flashcards for simple practice.
          </p>
          {user && (
            <div className="role-banner">
              <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-standard'}`}>
                {user.role === 'admin' ? 'Admin' : 'Standard User'}
              </span>
              <span className="role-text">Logged in as {user.username}</span>
            </div>
          )}
        </div>
      </header>

      <div className="nav-shell">
        <nav className="nav-bar">
          {isAuthenticated ? (
            <>
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/decks">Decks</NavLink>
              <NavLink to="/official-beginner-decks">Official Beginner Decks</NavLink>
              <NavLink to="/flashcards">Flashcards</NavLink>
              <NavLink to="/add">Add Flashcard</NavLink>
              {user?.role === 'admin' && <NavLink to="/import">Import</NavLink>}
              <NavLink to="/study">Study Session</NavLink>
              <button type="button" onClick={logout} className="secondary-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>

      <main className="page-content">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <FlashcardListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks"
            element={
              <ProtectedRoute>
                <DecksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-beginner-decks"
            element={
              <ProtectedRoute>
                <OfficialBeginnerDecksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddFlashcardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute>
                <ImportFlashcardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditFlashcardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study"
            element={
              <ProtectedRoute>
                <StudySessionPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
