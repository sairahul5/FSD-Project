import { useState } from 'react'
import { login } from '../api/auth'
import './Login.css'

function Login({ onRegister, onAuthSuccess, onMfaRequired, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('Signing in...')
    try {
      const data = await login(email, password)
      if (data.mfaRequired) {
        setStatus('Enter your MFA code')
        if (onMfaRequired) {
          onMfaRequired(data)
        }
      } else {
        setStatus('Signed in')
        if (onAuthSuccess) {
          onAuthSuccess(data)
        }
      }
    } catch (error) {
      setStatus(error.message || 'Login failed')
    }
  }

  return (
    <main className="login">
      <section className="login__panel app__panel">
        <div className="login__header">
          <p className="login__eyebrow">Welcome back</p>
          <h1 className="login__title">Sign in to Turisum</h1>
          <p className="login__subtitle">Use your account to book and chat.</p>
        </div>
        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__field">
            <span>Email</span>
            <input
              className="app__input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="login__field">
            <span>Password</span>
            <input
              className="app__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="app__button" type="submit">Sign in</button>
        </form>
        {status ? <p className="login__status">{status}</p> : null}
        <div className="login__footer">
          <span>Don't have an account?</span>
          <button className="login__link" type="button" onClick={onRegister}>Register</button>
        </div>
        <div className="login__footer">
          <span>Forgot your password?</span>
          <button className="login__link" type="button" onClick={onForgotPassword}>Reset</button>
        </div>
      </section>
    </main>
  )
}

export default Login
