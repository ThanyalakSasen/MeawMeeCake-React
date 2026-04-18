import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_USER_HINTS } from '../utils/mockUsers'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const success = login(username, password)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn">Sign in</button>
        </form>

        <div className="login-hints">
          <p className="login-hints-title">Demo accounts</p>
          <div className="hints-table">
            <div className="hints-header">
              <span>Username</span><span>Password</span><span>Role</span>
            </div>
            {MOCK_USER_HINTS.map((u) => (
              <div key={u.username} className="hints-row">
                <span>{u.username}</span>
                <span>{u.password}</span>
                <span className="hints-role">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
