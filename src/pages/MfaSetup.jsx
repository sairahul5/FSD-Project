import { useEffect, useState } from 'react'
import { enableMfa, setupMfa } from '../api/auth'
import { getUser } from '../api/session'
import './MfaSetup.css'

function MfaSetup() {
  const [setupData, setSetupData] = useState(null)
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')
  const [user] = useState(() => getUser())
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    if (user?.mfaEnabled && !showSetup) {
      return 
    }

    const load = async () => {
      setStatus('Generating MFA secret...')
      try {
        const data = await setupMfa()
        setSetupData(data)
        setStatus('Scan the QR in your authenticator app.')
      } catch (error) {
        setStatus(error.message || 'Failed to start MFA setup')
      }
    }

    load()
  }, [showSetup, user?.mfaEnabled])

  const handleEnable = async (event) => {
    event.preventDefault()
    setStatus('Enabling MFA...')
    try {
      await enableMfa(code)
      setStatus('MFA enabled for your account')
      // Update local session user to reflect change if needed, though session update handles it usually
    } catch (error) {
      setStatus(error.message || 'Failed to enable MFA')
    }
  }

  if (user?.mfaEnabled && !showSetup) {
    return (
      <main className="mfa">
        <section className="mfa__panel app__panel">
          <div className="mfa__header">
            <p className="mfa__eyebrow">Security</p>
            <h1 className="mfa__title">Multi-Factor Authentication</h1>
            <p className="mfa__subtitle">MFA is currently enabled for your account.</p>
          </div>
          <div className="mfa__actions">
             <button className="app__button" onClick={() => setShowSetup(true)}>Re-configure MFA</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="mfa">
      <section className="mfa__panel app__panel">
        <div className="mfa__header">
          <p className="mfa__eyebrow">Security</p>
          <h1 className="mfa__title">Set up MFA</h1>
          <p className="mfa__subtitle">Scan the URI in Google Authenticator and verify once.</p>
        </div>
        {setupData ? (
          <div className="mfa__details">
            <div className="mfa__qr">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  setupData.otpauthUri,
                )}`}
                alt="MFA QR code"
              />
            </div>
            <div>
              <strong>Secret</strong>
              <p>{setupData.secret}</p>
            </div>
            <div>
              <strong>OTP URI</strong>
              <p className="mfa__uri">{setupData.otpauthUri}</p>
            </div>
          </div>
        ) : null}
        <form className="mfa__form" onSubmit={handleEnable}>
          <label className="mfa__field">
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
          <button className="app__button" type="submit">Enable MFA</button>
        </form>
        {status ? <p className="mfa__status">{status}</p> : null}
      </section>
    </main>
  )
}

export default MfaSetup
