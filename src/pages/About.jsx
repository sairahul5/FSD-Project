import { useEffect, useState } from 'react'
import { getAboutPage } from '../api/about'
import './About.css'

function About() {
  const [people, setPeople] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const load = async () => {
      setStatus('Loading team...')
      try {
        const data = await getAboutPage()
        setPeople(Array.isArray(data) ? data : [])
        setStatus('')
      } catch (error) {
        setStatus(error.message || 'Failed to load team')
      }
    }

    load()
  }, [])

  return (
    <main className="about">
      <section className="about__hero app__section">
        <div className="about__hero-grid">
          <div className="app__panel">
            <p className="about__eyebrow">About Turisum</p>
            <h1 className="app__title">Stay local, travel deeper.</h1>
            <p className="app__subtitle">
              Turisum connects travelers with verified homestays and hosts who share their
              neighborhoods, culture, and stories. Every stay is built on trust, comfort, and
              community.
            </p>
            <div className="about__stats">
              <div>
                <strong>250+</strong>
                <span>Verified homestays</span>
              </div>
              <div>
                <strong>30</strong>
                <span>Local communities</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Guest support</span>
              </div>
            </div>
          </div>
          <div className="app__panel about__panel">
            <h2>What we do</h2>
            <p>
              We curate homestays that feel personal and effortless, with transparent pricing,
              secure bookings, and a host network that is ready to welcome you.
            </p>
            <ul className="about__list">
              <li>Match guests to stays that fit their pace and style.</li>
              <li>Highlight neighborhoods through local guides and recommendations.</li>
              <li>Keep bookings protected with verified hosts and clear policies.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="about__team app__section">
        <div className="about__team-header">
          <div>
            <h2>Meet the team</h2>
            <p>Creators, builders, and local experts behind Turisum.</p>
          </div>
          <span className="about__team-count">{people.length} people</span>
        </div>
        {status ? <p className="about__status">{status}</p> : null}
        <div className="about__team-grid">
          {people.map((person) => (
            <article className="about__person app__panel" key={person.id || person.name}>
              <div className="about__person-header">
                {person.imageUrl ? (
                  <img
                    className="about__person-image"
                    src={person.imageUrl}
                    alt={person.name || 'Team member'}
                    loading="lazy"
                  />
                ) : (
                  <div className="about__person-fallback">
                    {(person.name || 'Team')[0]}
                  </div>
                )}
                <div>
                  <h3>{person.name || 'Unnamed'}</h3>
                  <p className="about__person-role">{person.role || 'Team member'}</p>
                </div>
              </div>
              {person.bio ? <p className="about__person-bio">{person.bio}</p> : null}
              {person.infoEntries?.length ? (
                <dl className="about__person-info">
                  {person.infoEntries.map((entry, index) => (
                    <div key={`${person.id || person.name}-info-${index}`}>
                      <dt>{entry.label || 'Info'}</dt>
                      <dd>{entry.value || '-'}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {person.links?.length ? (
                <div className="about__person-links">
                  {person.links.map((link, index) => (
                    <a
                      key={`${person.id || person.name}-link-${index}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label || 'Link'}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      <section className="about__values app__section">
        <div className="about__values-grid">
          <div className="about__value app__panel">
            <span>01</span>
            <h3>Human first</h3>
            <p>We design travel around people, not listings. Hosts lead the experience.</p>
          </div>
          <div className="about__value app__panel">
            <span>02</span>
            <h3>Stay transparent</h3>
            <p>Clear pricing, honest reviews, and support that answers fast.</p>
          </div>
          <div className="about__value app__panel">
            <span>03</span>
            <h3>Build community</h3>
            <p>Every booking reinvests into local businesses and neighborhoods.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
