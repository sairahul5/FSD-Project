import { useState } from 'react'
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

function App() {
  const [route, setRoute] = useState(initialRoute)
  const [user, setUser] = useState(() => getUser())
  const [chatBookingId, setChatBookingId] = useState('')
  const [mfaToken, setMfaToken] = useState('')

  const handleAuthSuccess = (data) => {
    setUser({ email: data.email, role: data.role })
    setRoute('home')
  }

  const handleMfaRequired = (data) => {
    setMfaToken(data.mfaToken || '')
    setRoute('otp')
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setRoute('home')
  }

  const handleOpenChat = (bookingId) => {
    if (!bookingId) {
      return
    }
    setChatBookingId(String(bookingId))
    setRoute('chat')
  }

  return (
    <div className="app">
      <TopBar
        route={route}
        user={user}
        onNavigate={setRoute}
        onLogout={handleLogout}
      />
      {route === 'login' ? (
        <Login
          onRegister={() => setRoute('register')}
          onAuthSuccess={handleAuthSuccess}
          onMfaRequired={handleMfaRequired}
          onForgotPassword={() => setRoute('reset-password')}
        />
      ) : route === 'otp' ? (
        <OtpVerify
          mfaToken={mfaToken}
          onVerified={handleAuthSuccess}
          onBack={() => setRoute('login')}
        />
      ) : route === 'register' ? (
        <Register
          onLogin={() => setRoute('login')}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : route === 'reset-password' ? (
        <ResetPassword onBack={() => setRoute('login')} />
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
        <Home onExplore={() => setRoute('explore')} />
      )}
    </div>
  )
}

export default App
