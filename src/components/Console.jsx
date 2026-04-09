import './Console.css'

const DRAG_TYPE = 'application/x-portfolio-cartridge'

export default function Console({ insertedCartridge, onInsert, onEject, cartridges }) {
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    e.currentTarget.classList.add('console-slot--drag-over')
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('console-slot--drag-over')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('console-slot--drag-over')
    const id = e.dataTransfer.getData(DRAG_TYPE)
    if (id) {
      const cart = cartridges.find((c) => c.id === id)
      if (cart) onInsert(cart.id)
    }
  }

  const handleSlotClick = () => {
    if (insertedCartridge) onEject()
  }

  return (
    <div className="console">
      <div className="console-gamecube">
        <div className="console-gamecube-top" />
      </div>
      <div className="console-gb-player">
        <div
          className={`console-slot ${insertedCartridge ? 'console-slot--filled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleSlotClick}
          role="button"
          tabIndex={0}
          aria-label={insertedCartridge ? `Eject ${insertedCartridge.label}` : 'Drop cartridge here'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleSlotClick()
            }
          }}
        >
          {insertedCartridge ? (
            <span
              className="console-slot-label"
              style={{ '--slot-color': insertedCartridge.color }}
            >
              {insertedCartridge.label}
            </span>
          ) : (
            <span className="console-slot-hint">DRAG CARTRIDGE HERE</span>
          )}
        </div>
      </div>
    </div>
  )
}

export { DRAG_TYPE }
