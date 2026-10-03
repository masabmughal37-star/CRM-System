import React, { useState } from 'react';
import Dashboard from './Dashboard';
import API from './api';
import './Login.css';

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      ''
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await API.post('auth/token/', {
        email: username.trim(),
        password,
      });

      const accessToken = response.data?.access;
      const refreshToken = response.data?.refresh;

      if (!accessToken) {
        throw new Error('The server did not return an access token.');
      }

      localStorage.setItem('token', accessToken);
      localStorage.setItem('access_token', accessToken);

      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      setToken(accessToken);
    } catch (err) {
      console.error('Login failed:', err);

      setErrorMsg(
        err.response?.status === 401 ||
          err.response?.status === 400
          ? 'Login failed. Please check your credentials.'
          : 'Unable to log in. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        await API.post('auth/logout/', {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      // Local logout should still work if the API request fails.
      console.error('Backend logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setToken('');
      setUsername('');
      setPassword('');
      setErrorMsg('');
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Nexus CRM Login</h2>

          {errorMsg && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                borderRadius: '8px',
                color: '#EF4444',
                fontSize: '13px',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field-group">
              <label className="login-label">
                Email / Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="login-field-group">
              <label className="login-label">Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}
