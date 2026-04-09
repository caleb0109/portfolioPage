import Cartridge from './Cartridge'
import './CartridgeShelf.css'

export default function CartridgeShelf({ cartridges, selectedId, onSelect, dragType }) {
  return (
    <div className="cartridge-shelf" role="list">
      {cartridges.map((cart) => (
        <Cartridge
          key={cart.id}
          id={cart.id}
          label={cart.label}
          color={cart.color}
          selected={selectedId === cart.id}
          onSelect={() => onSelect(selectedId === cart.id ? null : cart.id)}
          dragType={dragType}
        />
      ))}
    </div>
  )
}
