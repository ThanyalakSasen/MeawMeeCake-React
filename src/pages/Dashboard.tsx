import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { parseToken, formatCountdown, isTokenValid } from '../utils/tokenUtils'
import './Dashboard.css'

const REFRESH_TOKEN_KEY = 'mmcake_refresh_token'

interface TokenInfo {
  accessExpiry: number
  refreshExpiry: number | null
  countdown: string
}

export default function Dashboard() {
  const { user, role, accessToken, logout } = useAuth()
  const navigate = useNavigate()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)

  useEffect(() => {
    const update = () => {
      if (!accessToken) return
      const access = parseToken(accessToken)
      const rawRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      const refresh = rawRefresh ? parseToken(rawRefresh) : null
      if (access) {
        setTokenInfo({
          accessExpiry: access.exp,
          refreshExpiry: refresh?.exp ?? null,
          countdown: formatCountdown(access.exp),
        })
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [accessToken])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-logo">MeawMeeCake</h1>
        <div className="dashboard-user">
          <span className="role-badge">{role}</span>
          <span className="user-badge">{user}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Welcome back, <span>{user}</span>!</h2>
          <p>Here's what's happening today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎂</div>
            <div className="stat-info">
              <span className="stat-value">24</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-value">4.9</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-value">฿12,800</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-value">38</span>
              <span className="stat-label">Customers</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Recent Orders</h3>
          <div className="orders-table">
            <div className="table-header">
              <span>Order</span>
              <span>Customer</span>
              <span>Item</span>
              <span>Status</span>
            </div>
            {[
              { id: '#001', customer: 'Nook', item: 'Matcha Cake', status: 'Delivered' },
              { id: '#002', customer: 'Fern', item: 'Strawberry Roll', status: 'Preparing' },
              { id: '#003', customer: 'Beam', item: 'Mango Cheesecake', status: 'Pending' },
            ].map((order) => (
              <div key={order.id} className="table-row">
                <span className="order-id">{order.id}</span>
                <span>{order.customer}</span>
                <span>{order.item}</span>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {tokenInfo && (
          <div className="dashboard-section">
            <h3>Session &amp; Token Info</h3>
            <div className="token-grid">
              <div className="token-card">
                <div className="token-card-header">
                  <span className="token-type-badge access">ACCESS TOKEN</span>
                  <span className={`token-status ${tokenInfo.accessExpiry > Math.floor(Date.now() / 1000) ? 'valid' : 'expired'}`}>
                    {tokenInfo.accessExpiry > Math.floor(Date.now() / 1000) ? 'Valid' : 'Expired'}
                  </span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Subject</span>
                  <span className="token-val">{user}</span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Role</span>
                  <span className="token-val">{role}</span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Expires at</span>
                  <span className="token-val">{new Date(tokenInfo.accessExpiry * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Time left</span>
                  <span className="token-val token-countdown">{tokenInfo.countdown}</span>
                </div>
              </div>

              <div className="token-card">
                <div className="token-card-header">
                  <span className="token-type-badge refresh">REFRESH TOKEN</span>
                  {tokenInfo.refreshExpiry && (
                    <span className={`token-status ${isTokenValid(localStorage.getItem('mmcake_refresh_token') ?? '') ? 'valid' : 'expired'}`}>
                      {isTokenValid(localStorage.getItem('mmcake_refresh_token') ?? '') ? 'Valid' : 'Expired'}
                    </span>
                  )}
                </div>
                <div className="token-detail">
                  <span className="token-key">Subject</span>
                  <span className="token-val">{user}</span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Storage</span>
                  <span className="token-val">localStorage</span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Expires at</span>
                  <span className="token-val">
                    {tokenInfo.refreshExpiry
                      ? new Date(tokenInfo.refreshExpiry * 1000).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className="token-detail">
                  <span className="token-key">Auto-refresh</span>
                  <span className="token-val">2 min before expiry</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
