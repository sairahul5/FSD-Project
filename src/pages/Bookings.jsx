import { useState } from 'react'
import { listBookingsForHost, listBookingsForTourist } from '../api/bookings'
import './Bookings.css'

function Bookings({ onOpenChat }) {
  const [role, setRole] = useState('TOURIST')
  const [userId, setUserId] = useState('')
  const [bookings, setBookings] = useState([])
  const [status, setStatus] = useState('')

  const handleLoad = async (event) => {
    event.preventDefault()
    if (!userId) {
      setStatus('Enter a user ID first')
      return
    }
    setStatus('Loading bookings...')
    try {
      const data =
        role === 'HOST'
          ? await listBookingsForHost(Number(userId))
          : await listBookingsForTourist(Number(userId))
      setBookings(data)
      setStatus('')
    } catch (error) {
      setStatus(error.message || 'Failed to load bookings')
    }
  }

  return (
    <main className="bookings">
      <section className="app__section bookings__header">
        <div>
          <h1 className="app__title">Your bookings</h1>
          <p className="app__subtitle">Track stays, see status, and open a chat.</p>
        </div>
        <form className="bookings__filters" onSubmit={handleLoad}>
          <select
            className="app__select"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="TOURIST">Tourist</option>
            <option value="HOST">Host</option>
          </select>
          <input
            className="app__input"
            type="number"
            placeholder="Your user ID"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
          <button className="app__button" type="submit">Load</button>
        </form>
      </section>

      <section className="app__section bookings__list">
        {status ? <p className="bookings__status">{status}</p> : null}
        {bookings.map((booking) => (
          <article className="bookings__card" key={booking.id}>
            <div>
              <h3>{booking.homestay?.name || 'Homestay'}</h3>
              <p className="bookings__meta">
                {booking.homestay?.location || 'Unknown location'} · {booking.status}
              </p>
              <div className="bookings__dates">
                <span>{booking.checkIn}</span>
                <span>→</span>
                <span>{booking.checkOut}</span>
              </div>
            </div>
            <button
              className="app__ghost"
              type="button"
              onClick={() => onOpenChat?.(booking.id)}
            >
              Open chat
            </button>
          </article>
        ))}
      </section>
    </main>
  )
 }

 export default Bookings
