import { useEffect, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { education, skills, experience } from '../data/portfolio'
import './BottomScreen.css'
import { resolveAssetUrl } from '../utils/assetUrl'

function lightboxSlideLeft(scroller, idx) {
  const child = scroller.children[idx]
  return child ? child.offsetLeft : 0
}

function lightboxIndexFromScroll(scroller) {
  const n = scroller.children.length
  if (n === 0) return 0
  const mid = scroller.scrollLeft + scroller.clientWidth * 0.5
  for (let i = 0; i < n; i++) {
    const c = scroller.children[i]
    if (mid < c.offsetLeft + c.offsetWidth) return i
  }
  return n - 1
}

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

  const displayImages = useMemo(() => {
    if (!screen || screen.type === 'about') return []
    const lower = screen.lowerScreenImages || []
    if (lower.length > 0) return lower
    const single = screen.lowerScreenImageUrl ?? screen.imageUrl
    return single ? [single] : []
  }, [screen])

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const scrollerRef = useRef(null)
  const lightboxOpenAtIndexRef = useRef(0)
  /** Ignore lightbox onScroll while applying initial scroll — avoids scrollLeft=0 resetting carousel index. */
  const ignoreLightboxScrollIndexRef = useRef(false)

  const images = screen?.lowerScreenImages || []
  const hasCarousel = images.length > 1

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
  }, [images.length, setIndex])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
  }, [images.length, setIndex])

  const lightboxGoPrev = useCallback(() => {
    setIndex((i) => {
      const n = displayImages.length
      if (n <= 1) return i
      return i <= 0 ? n - 1 : i - 1
    })
  }, [displayImages.length, setIndex])

  const lightboxGoNext = useCallback(() => {
    setIndex((i) => {
      const n = displayImages.length
      if (n <= 1) return i
      return i >= n - 1 ? 0 : i + 1
    })
  }, [displayImages.length, setIndex])

  const closeLightbox = useCallback(() => {
    ignoreLightboxScrollIndexRef.current = false
    setLightboxOpen(false)
  }, [])

  const openLightboxAt = useCallback(
    (slideIndex) => {
      const i = Math.max(0, Math.min(displayImages.length - 1, slideIndex))
      lightboxOpenAtIndexRef.current = i
      ignoreLightboxScrollIndexRef.current = true
      setIndex(i)
      setLightboxOpen(true)
    },
    [displayImages.length, setIndex]
  )

  const handleLightboxScroll = useCallback(() => {
    if (ignoreLightboxScrollIndexRef.current) return
    const el = scrollerRef.current
    if (!el || displayImages.length === 0) return
    const i = Math.max(
      0,
      Math.min(displayImages.length - 1, lightboxIndexFromScroll(el))
    )
    setIndex((prev) => (prev === i ? prev : i))
  }, [displayImages.length, setIndex])

  // Arrow key navigation (carousel on device screen)
  useEffect(() => {
    if (!hasCarousel) return
    const handleKeyDown = (e) => {
      if (lightboxOpen) return
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
  }, [hasCarousel, goPrev, goNext, lightboxOpen])

  // Lightbox: Escape, arrows when multiple images
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeLightbox()
        return
      }
      if (displayImages.length <= 1) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        lightboxGoPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        lightboxGoNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, displayImages.length, lightboxGoPrev, lightboxGoNext, closeLightbox])

  useEffect(() => {
    if (!lightboxOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [lightboxOpen])

  useLayoutEffect(() => {
    if (!lightboxOpen) return
    const el = scrollerRef.current
    if (!el) return
    const startIdx = lightboxOpenAtIndexRef.current
    ignoreLightboxScrollIndexRef.current = true
    let cancelled = false
    const clearIgnore = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) ignoreLightboxScrollIndexRef.current = false
        })
      })
    }
    let attempts = 0
    const tryScroll = () => {
      if (cancelled) return
      attempts += 1
      if (attempts > 90) {
        clearIgnore()
        return
      }
      if (el.clientWidth > 0 && el.children.length > 0) {
        const i = Math.min(startIdx, el.children.length - 1)
        el.scrollTo({ left: lightboxSlideLeft(el, i), behavior: 'auto' })
        clearIgnore()
        return
      }
      requestAnimationFrame(tryScroll)
    }
    tryScroll()
    return () => {
      cancelled = true
    }
  }, [lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return
    if (ignoreLightboxScrollIndexRef.current) return
    const el = scrollerRef.current
    if (!el || index >= el.children.length) return
    const target = lightboxSlideLeft(el, index)
    if (Math.abs(el.scrollLeft - target) > 3) {
      el.scrollTo({ left: target, behavior: 'auto' })
    }
  }, [index, lightboxOpen, displayImages.length])

  useEffect(() => {
    if (noCartridge || screen?.type === 'about') closeLightbox()
  }, [noCartridge, screen?.type, closeLightbox])

  const lightboxPortal =
    lightboxOpen &&
    displayImages.length > 0 &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        className="image-lightbox-backdrop"
        onClick={closeLightbox}
        role="presentation"
      >
        <button
          type="button"
          className="image-lightbox-close"
          onClick={(e) => {
            e.stopPropagation()
            closeLightbox()
          }}
          aria-label="Close enlarged image"
        >
          ×
        </button>
        <div
          className="image-lightbox-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged gallery"
        >
          <div className="image-lightbox-carousel">
            {displayImages.length > 1 && (
              <button
                type="button"
                className="image-lightbox-arrow image-lightbox-arrow--left"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxGoPrev()
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            <div
              ref={scrollerRef}
              className="image-lightbox-scroller"
              onScroll={handleLightboxScroll}
            >
              {displayImages.map((src, i) => (
                <div key={i} className="image-lightbox-slide">
                  <img
                    src={resolveAssetUrl(src)}
                    alt=""
                    className="image-lightbox-img"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            {displayImages.length > 1 && (
              <button
                type="button"
                className="image-lightbox-arrow image-lightbox-arrow--right"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxGoNext()
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>
          {displayImages.length > 1 && (
            <p className="image-lightbox-counter">
              {index + 1} / {displayImages.length}
            </p>
          )}
        </div>
      </div>,
      document.body
    )

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
                <div
                  key={i}
                  className={`bottom-screen-slide${i === index ? '' : ' bottom-screen-slide--inactive'}`}
                >
                  <button
                    type="button"
                    className="bottom-screen-img-hit"
                    onClick={() => openLightboxAt(i)}
                    aria-label="Enlarge image"
                  >
                    <img src={resolveAssetUrl(src)} alt="" className="bottom-screen-img" />
                  </button>
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
        {lightboxPortal}
      </div>
    )
  }

  // Fallback: single image or emoji (no text)
  const singleUrl = screen.lowerScreenImageUrl ?? screen.imageUrl
  return (
    <div className="bottom-screen">
      <div className="bottom-screen-image">
        {singleUrl ? (
          <button
            type="button"
            className="bottom-screen-img-hit bottom-screen-img-hit--solo"
            onClick={() => openLightboxAt(0)}
            aria-label="Enlarge image"
          >
            <img src={resolveAssetUrl(singleUrl)} alt="" className="bottom-screen-img" />
          </button>
        ) : (
          <span className="bottom-screen-emoji" aria-hidden="true">{imagePlaceholder}</span>
        )}
      </div>
      {lightboxPortal}
    </div>
  )
}
