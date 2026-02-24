import './TopBar.css'
import { useState } from 'react'

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'explore', label: 'Explore' },
  { key: 'about', label: 'About' },
  { key: 'bookings', label: 'Bookings' },
]

function TopBar({ route, user, onNavigate, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (key) => {
    onNavigate(key);
    setIsMenuOpen(false);
  }

  return (
    <header className="top-bar">
      <div className="top-bar__header">
        <div className="top-bar__brand-container" onClick={() => onNavigate('home')}>
          <span className="top-bar__brand">Turism</span>
          <span className="top-bar__tagline">stay local</span>
        </div>
        
        <button 
          className="top-bar__toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`top-bar__content ${isMenuOpen ? 'open' : ''}`}>
        <nav className="top-bar__nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`top-bar__btn ${route === item.key ? 'top-bar__btn--active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </button>
          ))}
          
          {user && (user.role === 'HOST' || user.role === 'TOURIST') && (
            <button
              className={`top-bar__btn ${route === 'chat' ? 'top-bar__btn--active' : ''}`}
              onClick={() => handleNav('chat')}
            >
              Chat
            </button>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
            <button
              className={`top-bar__btn ${route === 'admin' ? 'top-bar__btn--active' : ''}`}
              onClick={() => handleNav('admin')}
            >
              {user.role === 'EDITOR' ? 'Editor' : 'Admin'}
            </button>
          )}

          {user && (
            <button
              className={`top-bar__btn ${route === 'mfa-setup' ? 'top-bar__btn--active' : ''}`}
              onClick={() => handleNav('mfa-setup')}
            >
              MFA Setup
            </button>
          )}
        </nav>

        <div className="top-bar__actions">
          {user ? (
            <>
              <div className="user-snippet">
                <span className="user-email">{user.email}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <button className="btn-outline" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="top-bar__btn" onClick={() => onNavigate('login')}>
                Log in
              </button>
              <button className="btn-primary" onClick={() => onNavigate('register')}>
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar

