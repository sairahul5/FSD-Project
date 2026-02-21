import './TopBar.css'

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'explore', label: 'Homestays' },
  { key: 'bookings', label: 'Bookings' },
]

function TopBar({ route, user, onNavigate, onLogout }) {
  return (
    <header className="top-bar">
      <div className="top-bar__brand" role="button" onClick={() => onNavigate('home')}>
        Turisum
        <span>stay local</span>
      </div>
      <nav className="top-bar__nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`top-bar__link${route === item.key ? ' top-bar__link--active' : ''}`}
            type="button"
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
        {user && (user.role === 'HOST' || user.role === 'TOURIST') ? (
          <button
            className={`top-bar__link${route === 'chat' ? ' top-bar__link--active' : ''}`}
            type="button"
            onClick={() => onNavigate('chat')}
          >
            Chat
          </button>
        ) : null}
        {user?.role === 'ADMIN' ? (
          <button
            className={`top-bar__link${route === 'admin' ? ' top-bar__link--active' : ''}`}
            type="button"
            onClick={() => onNavigate('admin')}
          >
            Admin
          </button>
        ) : null}
      </nav>
      <div className="top-bar__actions">
        {user ? (
          <>
            <div className="top-bar__user">
              <span>{user.email}</span>
              <em>{user.role}</em>
            </div>
            <button className="top-bar__link" type="button" onClick={() => onNavigate('mfa-setup')}>
              MFA Setup
            </button>
            <button className="top-bar__cta" type="button" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <button className="top-bar__link" type="button" onClick={() => onNavigate('login')}>
              Login
            </button>
            <button className="top-bar__cta" type="button" onClick={() => onNavigate('register')}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default TopBar
