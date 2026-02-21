import { useEffect, useState } from 'react'
import { getHomePage } from '../api/homepage'
import './Home.css'

function Home({ onExplore }) {
  const [content, setContent] = useState(null)
  const [metrics, setMetrics] = useState({ homestayCount: 0, cityCount: 0, bookingCount: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHomePage()
        setContent(data)
        setMetrics({
          homestayCount: data.homestayCount ?? 0,
          cityCount: data.cityCount ?? 0,
          bookingCount: data.bookingCount ?? 0,
        })
      } catch (error) {
        setContent(null)
        setMetrics({ homestayCount: 0, cityCount: 0, bookingCount: 0 })
      }
    }

    load()
  }, [])

  return (
    <main className="home">
      <section className="home__hero app__section">
        <div className="home__hero-card app__panel">
          <p className="home__eyebrow">{content?.heroEyebrow}</p>
          <h1 className="home__title">{content?.heroTitle}</h1>
          <p className="home__lead">{content?.heroSubtitle}</p>
          <div className="home__actions">
            <button className="app__button" type="button" onClick={onExplore}>
              {content?.heroCtaPrimary}
            </button>
            <button className="app__ghost" type="button" onClick={() => onExplore?.()}>
              {content?.heroCtaSecondary}
            </button>
          </div>
          <div className="home__stats">
            <div>
              <strong>{metrics.homestayCount}</strong>
              <span>{content?.stat1Label}</span>
            </div>
            <div>
              <strong>{metrics.cityCount}</strong>
              <span>{content?.stat2Label}</span>
            </div>
            <div>
              <strong>{metrics.bookingCount}</strong>
              <span>{content?.stat3Label}</span>
            </div>
          </div>
        </div>
        <div className="home__hero-aside">
          {(content?.containers || [])
            .filter((container) => container.visible)
            .map((container) => (
              <div className="home__tile" key={container.id}>
                {container.metricValue != null ? (
                  <div className="home__tile-metric">
                    <strong>{container.metricValue}</strong>
                    <span>{metricLabel(container.metricKey)}</span>
                  </div>
                ) : null}
                <h3>{container.title}</h3>
                <p>{container.description}</p>
              </div>
            ))}
        </div>
      </section>
      {content?.flowVisible ? (
        <section className="home__flow app__section">
          <div className="home__flow-card app__panel">
            <div>
              <h2>{content?.flowTitle}</h2>
              <p>{content?.flowSubtitle}</p>
            </div>
            <div className="home__steps">
              {content?.step1Visible ? (
                <div>
                  <span>01</span>
                  <h4>{content?.step1Title}</h4>
                  <p>{content?.step1Description}</p>
                </div>
              ) : null}
              {content?.step2Visible ? (
                <div>
                  <span>02</span>
                  <h4>{content?.step2Title}</h4>
                  <p>{content?.step2Description}</p>
                </div>
              ) : null}
              {content?.step3Visible ? (
                <div>
                  <span>03</span>
                  <h4>{content?.step3Title}</h4>
                  <p>{content?.step3Description}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function metricLabel(metricKey) {
  if (!metricKey) {
    return ''
  }
  if (metricKey === 'CITY_COUNT') {
    return 'Places'
  }
  if (metricKey === 'HOMESTAY_COUNT') {
    return 'Homestays'
  }
  if (metricKey === 'BOOKING_COUNT') {
    return 'Bookings'
  }
  return ''
}

export default Home
