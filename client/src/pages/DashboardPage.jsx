import { useEffect, useState } from 'react';
import { getDashboardStats, getDecks, getStudySessions } from '../services/flashcardService';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState({ total: 0, mastered: 0, newCards: 0 });
  const [deckCount, setDeckCount] = useState(0);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: statsData }, { data: deckData }, { data: sessionData }] = await Promise.all([
          getDashboardStats(),
          getDecks(),
          getStudySessions()
        ]);
        setStats(statsData);
        setDeckCount(deckData.length);
        setSessions(sessionData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section className="page-section">
      <div className="card hero-card">
        <h2>Welcome to LinguaCards</h2>
        <p>Use this app to create language flashcards, track proficiency, and keep up with your daily reviews.</p>
        <p>
          Current access:
          {' '}
          <strong>{isAdmin ? 'Admin' : 'Standard User'}</strong>
          {isAdmin
            ? ' Admin access: you can manage official decks and all system flashcards.'
            : ' Standard access: you can manage only your own content and view official beginner decks.'}
        </p>
      </div>

      <div className="stats-grid">
        <article className="card stat-card">
          <h3>Total Flashcards</h3>
          <p className="stat-number">{stats.total}</p>
        </article>
        <article className="card stat-card">
          <h3>Mastered Cards</h3>
          <p className="stat-number">{stats.mastered}</p>
        </article>
        <article className="card stat-card">
          <h3>New Cards</h3>
          <p className="stat-number">{stats.newCards}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Decks</h3>
          <p className="stat-number">{deckCount}</p>
        </article>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h3>Recent Study Sessions</h3>
            <p className="muted-text">Your latest study activity appears here.</p>
          </div>
        </div>
        {sessions.length === 0 ? (
          <p>No study sessions recorded yet.</p>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="sub-card">
              <p>
                <strong>{new Date(session.completedAt).toLocaleString()}</strong>
              </p>
              <p className="muted-text">
                {session.reviewedCount}
                {' '}
                card(s)
                {session.deck ? ` in ${session.deck.name}` : ''}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
