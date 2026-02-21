import { useState } from 'react'
import { resetPassword } from '../api/auth'
import './ResetPassword.css'

function ResetPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setStatus('Passwords do not match')
      return
    }
    setStatus('Resetting password...')
    try {
      await resetPassword(email, code, password)
      setStatus('Password updated')
    } catch (error) {
      setStatus(error.message || 'Reset failed')
    }
  }

  return (
    <main className="reset">
      <section className="reset__panel app__panel">
        <div className="reset__header">
          <p className="reset__eyebrow">Password reset</p>
          <h1 className="reset__title">Reset your password</h1>
          <p className="reset__subtitle">Enter your MFA code to confirm the reset.</p>
        </div>
        <form className="reset__form" onSubmit={handleSubmit}>
          <label className="reset__field">
            <span>Email</span>
            <input
              className="app__input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="reset__field">
            <span>MFA Code</span>
            <input
              className="app__input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>
          <label className="reset__field">
            <span>New password</span>
            <input
              className="app__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="reset__field">
            <span>Confirm password</span>
            <input
              className="app__input"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>
          <div className="reset__actions">
            <button className="app__button" type="submit">Update password</button>
            <button className="app__ghost" type="button" onClick={onBack}>Back</button>
          </div>
        </form>
        {status ? <p className="reset__status">{status}</p> : null}
      </section>
    </main>
  )
}

export default ResetPassword
