import { useState } from 'react'
import { register } from '../api/auth'
import './Register.css'

function Register({ onLogin, onAuthSuccess }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setStatus('Passwords do not match')
      return
    }
    setStatus('Creating account...')
    try {
      const data = await register(fullName, email, password)
      setStatus('Account created')
      if (onAuthSuccess) {
        onAuthSuccess(data)
      }
      if (onLogin) {
        onLogin()
      }
    } catch (error) {
      setStatus(error.message || 'Registration failed')
    }
  }

  return (
    <main className="register">
      <section className="register__panel app__panel">
        <div className="register__header">
          <p className="register__eyebrow">Create your account</p>
          <h1 className="register__title">Join Turisum</h1>
          <p className="register__subtitle">Book stays, manage trips, and message hosts.</p>
        </div>
        <form className="register__form" onSubmit={handleSubmit}>
          <label className="register__field">
            <span>Full name</span>
            <input
              className="app__input"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label className="register__field">
            <span>Email</span>
            <input
              className="app__input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="register__field">
            <span>Password</span>
            <input
              className="app__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="register__field">
            <span>Confirm password</span>
            <input
              className="app__input"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>
          <button className="app__button" type="submit">Create account</button>
        </form>
        {status ? <p className="register__status">{status}</p> : null}
        <div className="register__footer">
          <span>Already have an account?</span>
          <button className="register__link" type="button" onClick={onLogin}>Login</button>
        </div>
      </section>
    </main>
  )
}

export default Register
