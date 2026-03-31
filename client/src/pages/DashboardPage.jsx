import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/flashcardService';

function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, mastered: 0, newCards: 0, dueToday: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <section>
      <div className="card">
        <h2>Welcome to LinguaCards</h2>
        <p>Use this app to create language flashcards, track proficiency, and keep up with your daily reviews.</p>
      </div>

      <div className="stats-grid">
        <article className="card">
          <h3>Total Flashcards</h3>
          <p className="stat-number">{stats.total}</p>
        </article>
        <article className="card">
          <h3>Mastered Cards</h3>
          <p className="stat-number">{stats.mastered}</p>
        </article>
        <article className="card">
          <h3>New Cards</h3>
          <p className="stat-number">{stats.newCards}</p>
        </article>
        <article className="card">
          <h3>Due Today</h3>
          <p className="stat-number">{stats.dueToday}</p>
        </article>
      </div>

      <div className="card quick-links">
        <Link to="/add">Add a new flashcard</Link>
        <Link to="/import">Import flashcards</Link>
        <Link to="/flashcards">View all flashcards</Link>
        <Link to="/study">Start studying</Link>
      </div>
    </section>
  );
}

export default DashboardPage;
