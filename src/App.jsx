import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Explore from './pages/Explore'
import Bookings from './pages/Bookings'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import OtpVerify from './pages/OtpVerify'
import MfaSetup from './pages/MfaSetup'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import { getUser } from './api/session'
import { logout } from './api/auth'

const initialRoute = 'home'

// Map paths to route keys
const getRouteFromPath = () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/explore') return 'explore';
    // if (path === '/explore') return 'explore'; // Handling query param? Explore seems to handle internal state
    if (path === '/about') return 'about';
    if (path === '/bookings') return 'bookings';
    if (path === '/chat') return 'chat';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/otp-verify') return 'otp';
    if (path === '/mfa-setup') return 'mfa-setup';
    if (path === '/reset-password') return 'reset-password';
    if (path === '/admin') return 'admin';
    return 'home';
}

function App() {
  const [route, setRoute] = useState(getRouteFromPath)
  const [user, setUser] = useState(() => getUser())
  const [chatBookingId, setChatBookingId] = useState('')
  const [mfaToken, setMfaToken] = useState('')

  // Sync route changes to URL
  const navigate = (newRoute) => {
      setRoute(newRoute);
      let path = '/';
      if (newRoute !== 'home') {
          if (newRoute === 'otp') path = '/otp-verify';
          else if (newRoute === 'mfa-setup' || newRoute === 'mfa') path = '/mfa-setup';
          else if (newRoute === 'reset-password' || newRoute === 'reset') path = '/reset-password';
          else if (newRoute === 'register') path = '/register';
          else if (newRoute === 'login') path = '/login';
          else path = `/${newRoute}`;
      }
      window.history.pushState({ route: newRoute }, '', path);
  }

  // Handle back/forward browser buttons
  useEffect(() => {
      const handlePopState = () => {
          setRoute(getRouteFromPath());
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAuthSuccess = (data) => {
    setUser({ email: data.email, role: data.role })
    navigate('home')
  }

  const handleMfaRequired = (data) => {
    setMfaToken(data.mfaToken || '')
    navigate('otp')
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('home')
  }

  const handleOpenChat = (bookingId) => {
    if (!bookingId) {
      return
    }
    setChatBookingId(String(bookingId))
    navigate('chat')
  }

  return (
    <div className="app">
      <TopBar
        route={route}
        user={user}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
      {route === 'login' ? (
        <Login
          onRegister={() => navigate('register')}
          onAuthSuccess={handleAuthSuccess}
          onMfaRequired={handleMfaRequired}
          onForgotPassword={() => navigate('reset-password')}
        />
      ) : route === 'otp' ? (
        <OtpVerify
          mfaToken={mfaToken}
          onVerified={handleAuthSuccess}
          onBack={() => navigate('login')}
        />
      ) : route === 'register' ? (
        <Register
          onLogin={() => navigate('login')}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : route === 'reset-password' ? (
        <ResetPassword onBack={() => navigate('login')} />
      ) : route === 'explore' ? (
        <Explore isAuthed={Boolean(user)} />
      ) : route === 'about' ? (
        <About />
      ) : route === 'bookings' ? (
        <Bookings onOpenChat={handleOpenChat} />
      ) : route === 'chat' ? (
        <Chat initialBookingId={chatBookingId} />
      ) : route === 'admin' ? (
        <AdminDashboard />
      ) : route === 'mfa-setup' ? (
        <MfaSetup />
      ) : (
        <Home onExplore={() => navigate('explore')} />
      )}
    </div>
  )
}

export default App
