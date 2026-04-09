import './Cartridge.css'

export default function Cartridge({ id, label, color, selected, onSelect, dragType, asPeek }) {
  const handleDragStart = (e) => {
    if (dragType) {
      e.dataTransfer.setData(dragType, id)
      e.dataTransfer.effectAllowed = 'move'
      e.currentTarget.classList.add('cartridge--dragging')
    }
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('cartridge--dragging')
  }

  const content = (
    <div className="cartridge-body">
      <div className="cartridge-label">{label}</div>
      <div className="cartridge-notch" />
    </div>
  )

  if (asPeek) {
    return (
      <div
        className={`cartridge cartridge--peek ${selected ? 'cartridge--selected' : ''}`}
        style={{ '--cart-color': color }}
        aria-hidden
        draggable={!!dragType}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`cartridge ${selected ? 'cartridge--selected' : ''}`}
      style={{ '--cart-color': color }}
      onClick={onSelect}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={!!dragType}
      aria-pressed={selected}
      aria-label={`Select ${label}`}
    >
      {content}
    </button>
  )
}
