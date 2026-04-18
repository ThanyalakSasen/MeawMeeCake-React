import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { parseToken, formatCountdown } from '../utils/tokenUtils'

const REFRESH_TOKEN_KEY = 'mmcake_refresh_token'

interface TokenInfo {
  accessExpiry: number
  refreshExpiry: number | null
  countdown: string
  accessValid: boolean
  refreshValid: boolean
}

const statusVariant: Record<string, string> = {
  delivered: 'success',
  preparing: 'warning',
  pending: 'primary',
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
        const now = Math.floor(Date.now() / 1000)
        setTokenInfo({
          accessExpiry: access.exp,
          refreshExpiry: refresh?.exp ?? null,
          countdown: formatCountdown(access.exp),
          accessValid: access.exp > now,
          refreshValid: refresh ? refresh.exp > now : false,
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

  const accessValid = tokenInfo?.accessValid ?? false
  const refreshValid = tokenInfo?.refreshValid ?? false

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark bg-black border-bottom border-secondary px-4">
        <span className="navbar-brand fw-bold text-primary">MeawMeeCake</span>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary">{role}</span>
          <span className="badge bg-secondary">{user}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="container py-4">
        <div className="mb-4">
          <h2 className="fw-bold">Welcome back, <span className="text-primary">{user}</span>!</h2>
          <p className="text-secondary mb-0">{"Here's what's happening today."}</p>
        </div>

        <div className="row g-3 mb-4">
          {[
            { icon: '🎂', value: '24',      label: 'Total Orders' },
            { icon: '⭐', value: '4.9',     label: 'Rating'       },
            { icon: '💰', value: '฿12,800', label: 'Revenue'      },
            { icon: '👥', value: '38',      label: 'Customers'    },
          ].map((stat) => (
            <div key={stat.label} className="col-sm-6 col-xl-3">
              <div className="card bg-secondary-subtle border-secondary h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                  <div>
                    <div className="fw-bold fs-4">{stat.value}</div>
                    <div className="text-secondary small">{stat.label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h5 className="mb-3">Recent Orders</h5>
          <div className="table-responsive">
            <table className="table table-dark table-bordered table-hover align-middle mb-0">
              <thead className="table-secondary text-uppercase small">
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '#001', customer: 'Nook', item: 'Matcha Cake',      status: 'Delivered' },
                  { id: '#002', customer: 'Fern', item: 'Strawberry Roll',  status: 'Preparing' },
                  { id: '#003', customer: 'Beam', item: 'Mango Cheesecake', status: 'Pending'   },
                ].map((order) => (
                  <tr key={order.id}>
                    <td><code className="text-primary">{order.id}</code></td>
                    <td>{order.customer}</td>
                    <td>{order.item}</td>
                    <td>
                      <span className={`badge bg-${statusVariant[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {tokenInfo && (
          <div>
            <h5 className="mb-3">Session &amp; Token Info</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card bg-secondary-subtle border-secondary h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-primary">ACCESS TOKEN</span>
                      <span className={`badge ${accessValid ? 'bg-success' : 'bg-danger'}`}>
                        {accessValid ? 'Valid' : 'Expired'}
                      </span>
                    </div>
                    <table className="table table-dark table-sm mb-0" style={{ fontSize: '0.82rem' }}>
                      <tbody>
                        <tr><td className="text-secondary">Subject</td><td><code>{user}</code></td></tr>
                        <tr><td className="text-secondary">Role</td><td><code>{role}</code></td></tr>
                        <tr><td className="text-secondary">Expires at</td><td><code>{new Date(tokenInfo.accessExpiry * 1000).toLocaleTimeString()}</code></td></tr>
                        <tr>
                          <td className="text-secondary">Time left</td>
                          <td><span className="fw-bold text-success">{tokenInfo.countdown}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card bg-secondary-subtle border-secondary h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-info">REFRESH TOKEN</span>
                      <span className={`badge ${refreshValid ? 'bg-success' : 'bg-danger'}`}>
                        {refreshValid ? 'Valid' : 'Expired'}
                      </span>
                    </div>
                    <table className="table table-dark table-sm mb-0" style={{ fontSize: '0.82rem' }}>
                      <tbody>
                        <tr><td className="text-secondary">Subject</td><td><code>{user}</code></td></tr>
                        <tr><td className="text-secondary">Storage</td><td><code>localStorage</code></td></tr>
                        <tr>
                          <td className="text-secondary">Expires at</td>
                          <td><code>{tokenInfo.refreshExpiry ? new Date(tokenInfo.refreshExpiry * 1000).toLocaleDateString() : 'N/A'}</code></td>
                        </tr>
                        <tr><td className="text-secondary">Auto-refresh</td><td><code>2 min before expiry</code></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
