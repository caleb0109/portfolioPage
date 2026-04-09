import { useState, useEffect, useCallback } from 'react'
import { profile, cartridges, screenContent } from './data/portfolio'
import Hero from './components/Hero'
import DS, { DRAG_TYPE } from './components/DS'
import TVScreen from './components/TVScreen'
import BottomScreen from './components/BottomScreen'
import CartridgeShelf from './components/CartridgeShelf'
import './App.css'

function App() {
  const [selectedCartridge, setSelectedCartridge] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [slotSlideDirection, setSlotSlideDirection] = useState(null)
  const [animatingCartridge, setAnimatingCartridge] = useState(null)
  const [dsFrameClick, setDsFrameClick] = useState(false)

  const currentScreen = selectedCartridge
    ? screenContent[cartridges.find((c) => c.id === selectedCartridge)?.screen]
    : null

  const insertedCartridge = selectedCartridge
    ? cartridges.find((c) => c.id === selectedCartridge) ?? null
    : null

  const imageCount = currentScreen?.lowerScreenImages?.length ?? 0

  useEffect(() => {
    setCarouselIndex(0)
  }, [selectedCartridge])

  const onDpadLeft = useCallback(() => {
    setCarouselIndex((i) => (i <= 0 ? Math.max(0, imageCount - 1) : i - 1))
  }, [imageCount])

  const onDpadRight = useCallback(() => {
    setCarouselIndex((i) => (imageCount <= 1 ? 0 : i >= imageCount - 1 ? 0 : i + 1))
  }, [imageCount])

  const currentProjectIndex = selectedCartridge
    ? cartridges.findIndex((c) => c.id === selectedCartridge)
    : -1

  const prevCartridge =
    cartridges.length > 0
      ? cartridges[currentProjectIndex <= 0 ? cartridges.length - 1 : currentProjectIndex - 1]
      : null
  const nextCartridge =
    cartridges.length > 0
      ? cartridges[currentProjectIndex < 0 ? 0 : (currentProjectIndex + 1) % cartridges.length]
      : null

  const onPrevProject = useCallback(() => {
    if (cartridges.length === 0) return
    const prev = currentProjectIndex <= 0 ? cartridges.length - 1 : currentProjectIndex - 1
    const cart = cartridges[prev]
    setAnimatingCartridge(cart)
    setSlotSlideDirection('left')
    setSelectedCartridge(cart.id)
  }, [cartridges, currentProjectIndex])

  const onNextProject = useCallback(() => {
    if (cartridges.length === 0) return
    const next = currentProjectIndex < 0 ? 0 : (currentProjectIndex + 1) % cartridges.length
    const cart = cartridges[next]
    setAnimatingCartridge(cart)
    setSlotSlideDirection('right')
    setSelectedCartridge(cart.id)
  }, [cartridges, currentProjectIndex])

  useEffect(() => {
    if (slotSlideDirection == null) return
    const t = setTimeout(() => {
      setSlotSlideDirection(null)
      setAnimatingCartridge(null)
    }, 500)
    return () => clearTimeout(t)
  }, [slotSlideDirection])

  useEffect(() => {
    if (!dsFrameClick) return
    const t = setTimeout(() => setDsFrameClick(false), 600)
    return () => clearTimeout(t)
  }, [dsFrameClick])

  const handleInsert = useCallback((id) => {
    setSelectedCartridge(id)
    setDsFrameClick(true)
  }, [])

  const handleShelfSelect = useCallback((id) => {
    setSelectedCartridge(id)
    setDsFrameClick(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.closest('input, textarea, [contenteditable="true"]')) return
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        onPrevProject()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onNextProject()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrevProject, onNextProject])

  return (
    <div className="app">
      <Hero profile={profile} />
      <main className="main">
        <DS
          topScreen={
            <TVScreen
              profile={profile}
              screen={currentScreen}
              noCartridge={!selectedCartridge}
            />
          }
          bottomScreen={
            <BottomScreen
              screen={currentScreen}
              noCartridge={!selectedCartridge}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
            />
          }
          insertedCartridge={insertedCartridge}
          onInsert={handleInsert}
          onEject={() => setSelectedCartridge(null)}
          cartridges={cartridges}
          prevCartridge={prevCartridge}
          nextCartridge={nextCartridge}
          slotSlideDirection={slotSlideDirection}
          animatingCartridge={animatingCartridge}
          dsFrameClick={dsFrameClick}
          onDpadLeft={onDpadLeft}
          onDpadRight={onDpadRight}
          onPrevProject={onPrevProject}
          onNextProject={onNextProject}
        />
        <CartridgeShelf
          cartridges={cartridges}
          selectedId={selectedCartridge}
          onSelect={handleShelfSelect}
          dragType={DRAG_TYPE}
        />
      </main>
    </div>
  )
}

export default App
