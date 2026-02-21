import { useState } from 'react'
import { verifyOtp } from '../api/auth'
import './OtpVerify.css'

function OtpVerify({ mfaToken, onVerified, onBack }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!mfaToken) {
      setStatus('Missing MFA token. Please sign in again.')
      return
    }
    setStatus('Verifying code...')
    try {
      const data = await verifyOtp(mfaToken, code)
      setStatus('Signed in')
      if (onVerified) {
        onVerified(data)
      }
    } catch (error) {
      setStatus(error.message || 'Invalid code')
    }
  }

  return (
    <main className="otp">
      <section className="otp__panel app__panel">
        <div className="otp__header">
          <p className="otp__eyebrow">Two-step verification</p>
          <h1 className="otp__title">Enter your MFA code</h1>
          <p className="otp__subtitle">Use the 6-digit code from your authenticator app.</p>
        </div>
        <form className="otp__form" onSubmit={handleSubmit}>
          <label className="otp__field">
            <span>OTP Code</span>
            <input
              className="app__input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>
          <div className="otp__actions">
            <button className="app__button" type="submit">Verify</button>
            <button className="app__ghost" type="button" onClick={onBack}>Back</button>
          </div>
        </form>
        {status ? <p className="otp__status">{status}</p> : null}
      </section>
    </main>
  )
}

export default OtpVerify
