import { useEffect, useCallback } from 'react'
import { education, skills, experience } from '../data/portfolio'
import './BottomScreen.css'

function ResumeScreen() {
  return (
    <div className="bottom-screen bottom-screen--resume">
      <div className="bottom-resume-section">
        <h3 className="bottom-resume-h3">Education</h3>
        <p><strong>{education.school}</strong> — {education.period}</p>
        <p>{education.degree}</p>
        <p className="bottom-resume-small">{education.coursework}</p>
      </div>
      <div className="bottom-resume-section">
        <h3 className="bottom-resume-h3">Skills</h3>
        <p className="bottom-resume-small">{skills.languages}</p>
        <p className="bottom-resume-small">{skills.frameworks}</p>
        <p className="bottom-resume-small">{skills.engines}</p>
        <p className="bottom-resume-small">{skills.awards}</p>
      </div>
      <div className="bottom-resume-section">
        <h3 className="bottom-resume-h3">Experience</h3>
        {experience.map((exp, i) => (
          <p key={i} className="bottom-resume-small bottom-resume-exp-line">
            <strong>{exp.role}</strong>
            {exp.org ? `, ${exp.org}` : ''}
            {exp.location ? ` · ${exp.location}` : ''}
            {exp.period ? ` — ${exp.period}` : ''}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function BottomScreen({ screen, noCartridge, carouselIndex, setCarouselIndex }) {
  const index = carouselIndex ?? 0
  const setIndex = setCarouselIndex ?? (() => {})

  const images = screen?.lowerScreenImages || []
  const hasCarousel = images.length > 1

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }, [images.length, setIndex])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }, [images.length, setIndex])

  // Arrow key navigation
  useEffect(() => {
    if (!hasCarousel) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasCarousel, goPrev, goNext])

  if (noCartridge) {
    return <ResumeScreen />
  }

  if (!screen) return null

  if (screen.type === 'about') {
    return <ResumeScreen />
  }

  const imagePlaceholder = screen.lowerScreenImage ?? screen.imagePlaceholder

  // Carousel: sliding track of images
  if (images.length > 0) {
    return (
      <div className="bottom-screen bottom-screen--carousel">
        <div className="bottom-screen-carousel">
          {hasCarousel && (
            <button
              type="button"
              className="bottom-screen-arrow bottom-screen-arrow--left"
              onClick={goPrev}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}
          <div className="bottom-screen-viewport">
            <div
              className="bottom-screen-track"
              style={{
                '--count': images.length,
                width: `${images.length * 100}%`,
                transform: `translateX(calc(-100% * ${index} / ${images.length}))`,
              }}
            >
              {images.map((src, i) => (
                <div key={i} className="bottom-screen-slide">
                  <img src={src} alt="" className="bottom-screen-img" />
                </div>
              ))}
            </div>
          </div>
          {hasCarousel && (
            <button
              type="button"
              className="bottom-screen-arrow bottom-screen-arrow--right"
              onClick={goNext}
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
        {hasCarousel && (
          <p className="bottom-screen-counter">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    )
  }

  // Fallback: single image or emoji (no text)
  const singleUrl = screen.lowerScreenImageUrl ?? screen.imageUrl
  return (
    <div className="bottom-screen">
      <div className="bottom-screen-image">
        {singleUrl ? (
          <img src={singleUrl} alt="" className="bottom-screen-img" />
        ) : (
          <span className="bottom-screen-emoji" aria-hidden="true">{imagePlaceholder}</span>
        )}
      </div>
    </div>
  )
}
