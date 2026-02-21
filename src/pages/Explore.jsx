import { useEffect, useState } from 'react'
import { searchHomestays } from '../api/homestays'
import { createBooking } from '../api/bookings'
import './Explore.css'

const emptyBooking = {
  touristId: '',
  checkIn: '',
  checkOut: '',
}

function Explore({ isAuthed }) {
  const [query, setQuery] = useState('')
  const [homestays, setHomestays] = useState([])
  const [status, setStatus] = useState('')
  const [selectedHomestay, setSelectedHomestay] = useState(null)
  const [bookingForm, setBookingForm] = useState(emptyBooking)
  const [bookingStatus, setBookingStatus] = useState('')

  useEffect(() => {
    const load = async () => {
      setStatus('Loading homestays...')
      try {
        const data = await searchHomestays('')
        setHomestays(data)
        setStatus('')
      } catch (error) {
        setStatus(error.message || 'Failed to load homestays')
      }
    }

    load()
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    setStatus('Searching...')
    try {
      const data = await searchHomestays(query)
      setHomestays(data)
      setStatus('')
    } catch (error) {
      setStatus(error.message || 'Failed to search homestays')
    }
  }

  const handleSubmitBooking = async (event) => {
    event.preventDefault()
    if (!selectedHomestay) {
      setBookingStatus('Select a homestay first.')
      return
    }
    if (!bookingForm.touristId || !bookingForm.checkIn || !bookingForm.checkOut) {
      setBookingStatus('Fill all booking fields.')
      return
    }
    setBookingStatus('Submitting booking...')
    try {
      await createBooking({
        homestayId: selectedHomestay.id,
        touristId: Number(bookingForm.touristId),
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
      })
      setBookingForm(emptyBooking)
      setBookingStatus('Booking request sent!')
    } catch (error) {
      setBookingStatus(error.message || 'Failed to create booking')
    }
  }

  return (
    <main className="explore">
      <section className="explore__hero app__section">
        <div>
          <h1 className="app__title">Explore homestays</h1>
          <p className="app__subtitle">Search by city, compare hosts, and book in minutes.</p>
        </div>
        <form className="explore__search" onSubmit={handleSearch}>
          <input
            className="app__input"
            type="text"
            placeholder="Search city or neighborhood"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="app__button" type="submit">Search</button>
        </form>
      </section>

      <section className="explore__grid app__section">
        <div className="explore__list">
          {status ? <p className="explore__status">{status}</p> : null}
          {homestays.map((homestay) => (
            <article className="explore__card" key={homestay.id}>
              <div>
                <h3>{homestay.name}</h3>
                <p className="explore__meta">{homestay.location}</p>
                <p className="explore__desc">{homestay.description}</p>
                <div className="explore__price">${homestay.pricePerNight} / night</div>
              </div>
              <button
                className="app__ghost"
                type="button"
                onClick={() => setSelectedHomestay(homestay)}
              >
                Book this stay
              </button>
            </article>
          ))}
        </div>
        <aside className="explore__booking app__panel">
          <h2>Book a stay</h2>
          <p className="explore__booking-sub">
            {selectedHomestay
              ? `Selected: ${selectedHomestay.name}`
              : 'Choose a homestay to start.'}
          </p>
          {!isAuthed ? (
            <p className="explore__auth-hint">Login to store your session, then enter your user ID.</p>
          ) : null}
          <form className="explore__form" onSubmit={handleSubmitBooking}>
            <label>
              Tourist ID
              <input
                className="app__input"
                type="number"
                value={bookingForm.touristId}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, touristId: event.target.value }))
                }
              />
            </label>
            <label>
              Check-in
              <input
                className="app__input"
                type="date"
                value={bookingForm.checkIn}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, checkIn: event.target.value }))
                }
              />
            </label>
            <label>
              Check-out
              <input
                className="app__input"
                type="date"
                value={bookingForm.checkOut}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, checkOut: event.target.value }))
                }
              />
            </label>
            <button className="app__button" type="submit">
              Confirm booking
            </button>
          </form>
          {bookingStatus ? <p className="explore__status">{bookingStatus}</p> : null}
        </aside>
      </section>
    </main>
  )
}

export default Explore
