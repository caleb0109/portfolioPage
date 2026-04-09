import './DS.css'
import Cartridge from './Cartridge'

const DRAG_TYPE = 'application/x-portfolio-cartridge'

export default function DS({
  topScreen,
  bottomScreen,
  insertedCartridge,
  onInsert,
  onEject,
  cartridges,
  prevCartridge,
  nextCartridge,
  slotSlideDirection,
  animatingCartridge,
  dsFrameClick,
  onDpadLeft,
  onDpadRight,
  onPrevProject,
  onNextProject,
}) {
  const handleFrameDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleFrameDrop = (e) => {
    e.preventDefault()
    const id = e.dataTransfer.getData(DRAG_TYPE)
    if (id) {
      const cart = cartridges.find((c) => c.id === id)
      if (cart) onInsert(cart.id)
    }
  }

  return (
    <div className="ds">
      <button
        type="button"
        className={`ds-cartridge-peek ds-cartridge-peek--left${slotSlideDirection === 'left' ? ' ds-cartridge-peek--animating' : ''}`}
        onClick={onPrevProject}
        aria-label="Previous project"
        disabled={!prevCartridge}
      >
        {(slotSlideDirection === 'left' && animatingCartridge ? animatingCartridge : prevCartridge) && (
          <span className="ds-cartridge-peek-inner">
            <Cartridge
              id={(slotSlideDirection === 'left' && animatingCartridge ? animatingCartridge : prevCartridge).id}
              label={(slotSlideDirection === 'left' && animatingCartridge ? animatingCartridge : prevCartridge).label}
              color={(slotSlideDirection === 'left' && animatingCartridge ? animatingCartridge : prevCartridge).color}
              selected={false}
              asPeek
              dragType={DRAG_TYPE}
            />
          </span>
        )}
      </button>
      <div
        className={`ds-frame${slotSlideDirection || dsFrameClick ? ' ds-frame--click' : ''}`}
        onDragOver={handleFrameDragOver}
        onDrop={handleFrameDrop}
      >
        <div className="ds-top">
          <div className="ds-speakers ds-speakers--left" aria-hidden="true" />
          <div className="ds-top-screen">
            {topScreen}
          </div>
          <div className="ds-speakers ds-speakers--right" aria-hidden="true" />
        </div>
        <div className="ds-hinge-wrap" aria-hidden="true">
          <div className="ds-hinge-barrel ds-hinge-barrel--left" />
          <div className="ds-hinge" />
          <div className="ds-hinge-barrel ds-hinge-barrel--right" />
          <div className="ds-power" aria-hidden="true" />
        </div>
        <div className="ds-bottom">
          <div className="ds-system-controls" aria-hidden="true">
            <button type="button" className="ds-power-btn" disabled>Power</button>
            <div className="ds-system-buttons ds-system-buttons--right">
              <button type="button" className="ds-system-btn ds-system-btn--select" disabled>Select</button>
              <button type="button" className="ds-system-btn ds-system-btn--start" disabled>Start</button>
            </div>
          </div>
          <div className="ds-controls-row">
            <div className="ds-dpad">
              <span className="ds-dpad-inner" aria-hidden="true" />
              <button type="button" className="ds-dpad-btn ds-dpad-btn--left" onClick={onDpadLeft} aria-label="Previous (carousel)" />
              <button type="button" className="ds-dpad-btn ds-dpad-btn--right" onClick={onDpadRight} aria-label="Next (carousel)" />
              <button type="button" className="ds-dpad-btn ds-dpad-btn--up" aria-label="D-pad up" disabled />
              <button type="button" className="ds-dpad-btn ds-dpad-btn--down" aria-label="D-pad down" disabled />
            </div>
            <div className="ds-bottom-screen">
              {bottomScreen}
            </div>
            <div className="ds-buttons" aria-hidden="true">
              <span className="ds-btn ds-btn--x">X</span>
              <span className="ds-btn ds-btn--y">Y</span>
              <span className="ds-btn ds-btn--b">B</span>
              <span className="ds-btn ds-btn--a">A</span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`ds-cartridge-peek ds-cartridge-peek--right${slotSlideDirection === 'right' ? ' ds-cartridge-peek--animating' : ''}`}
        onClick={onNextProject}
        aria-label="Next project"
        disabled={!nextCartridge}
      >
        {(slotSlideDirection === 'right' && animatingCartridge ? animatingCartridge : nextCartridge) && (
          <span className="ds-cartridge-peek-inner">
            <Cartridge
              id={(slotSlideDirection === 'right' && animatingCartridge ? animatingCartridge : nextCartridge).id}
              label={(slotSlideDirection === 'right' && animatingCartridge ? animatingCartridge : nextCartridge).label}
              color={(slotSlideDirection === 'right' && animatingCartridge ? animatingCartridge : nextCartridge).color}
              selected={false}
              asPeek
              dragType={DRAG_TYPE}
            />
          </span>
        )}
      </button>
    </div>
  )
}

export { DRAG_TYPE }
