import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import FlashcardListPage from './pages/FlashcardListPage';
import AddFlashcardPage from './pages/AddFlashcardPage';
import EditFlashcardPage from './pages/EditFlashcardPage';
import StudySessionPage from './pages/StudySessionPage';
import ImportFlashcardsPage from './pages/ImportFlashcardsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>LinguaCards</h1>
        <p>
          Simple language flashcards for vocabulary practice.
          {user ? ` Signed in as ${user.username} (${user.role}).` : ''}
        </p>
      </header>

      <nav className="nav-bar">
        {isAuthenticated ? (
          <>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/flashcards">Flashcards</NavLink>
            {isAdmin && <NavLink to="/add">Add Flashcard</NavLink>}
            {isAdmin && <NavLink to="/import">Import</NavLink>}
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

      <main className="page-content">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
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
            path="/add"
            element={
              <ProtectedRoute requireAdmin>
                <AddFlashcardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute requireAdmin>
                <ImportFlashcardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
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
