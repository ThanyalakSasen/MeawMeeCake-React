import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-logo">MeawMeeCake</h1>
        <div className="dashboard-user">
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
      </main>
    </div>
  )
}
