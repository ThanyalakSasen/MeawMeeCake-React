import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_USER_HINTS } from '../utils/mockUsers'

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card bg-secondary-subtle border-secondary shadow-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-4">
          <h1 className="card-title fs-4 fw-bold mb-1">Welcome back</h1>
          <p className="text-secondary mb-4">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              Sign in
            </button>
          </form>

          <div className="mt-4">
            <p className="text-secondary small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.06em' }}>
              Demo accounts
            </p>
            <table className="table table-sm table-dark table-bordered mb-0" style={{ fontSize: '0.82rem' }}>
              <thead className="table-secondary">
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USER_HINTS.map((u) => (
                  <tr key={u.username}>
                    <td><code>{u.username}</code></td>
                    <td><code>{u.password}</code></td>
                    <td><span className="badge bg-primary">{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
