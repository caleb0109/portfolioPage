import './CRT.css'

export default function CRT({ children }) {
  return (
    <div className="crt">
      <div className="crt-frame">
        <div className="crt-bezel">
          <div className="crt-screen-wrap">
            <div className="crt-scanlines" aria-hidden="true" />
            <div className="crt-screen">
              {children}
            </div>
          </div>
        </div>
        <div className="crt-brand">RETRO PORTFOLIO</div>
      </div>
    </div>
  )
}
