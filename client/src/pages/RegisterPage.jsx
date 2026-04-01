import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', isAdmin: false });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      const user = await register({
        username: formData.username,
        password: formData.password,
        isAdmin: formData.isAdmin
      });
      navigate(user.role === 'admin' ? '/official-beginner-decks' : '/', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <section>
      <div className="card auth-card">
        <h2>Register</h2>

        <form className="form-card" onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={formData.username} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>

          <label>
            Confirm Password
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </label>

          <label className="checkbox-label">
            <span>I am an Admin</span>
            <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
