import './Hero.css'

export default function Hero({ profile }) {
  return (
    <header className="hero">
      <h1 className="hero-name">{profile.name}</h1>
      <p className="hero-tagline">{profile.tagline}</p>
      <div className="hero-links">
        <a href={`mailto:${profile.email}`} className="hero-link" aria-label="Email">
          📧 {profile.email}
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="GitHub">
          Github
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="LinkedIn">
          LinkedIn
        </a>
        {profile.itch && (
          <a href={profile.itch} target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="itch.io">
            itch.io
          </a>
        )}
      </div>
    </header>
  )
}
