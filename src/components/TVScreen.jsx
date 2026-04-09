import './TVScreen.css'

const INTRO_PARA_1 =
  "Hello! I'm 24 years old game developer / producer with a degree in Game Design and Development from RIT."

const INTRO_PARA_2 =
  "My skill sets include, but is not limited to C# and C++ programming, Project Management using Agile and Waterfall, Jira, Scrum, and more. To check out my projects, click one of the cartridges to learn more!"

function IntroScreen({ profileName }) {
  return (
    <div className="tv-screen tv-intro-split">
      <div className="tv-intro-copy">
        <p className="tv-intro-body">{INTRO_PARA_1}</p>
        <p className="tv-intro-body tv-intro-body--after-break">{INTRO_PARA_2}</p>
      </div>
      <div className="tv-intro-photo-wrap">
        <img
          className="tv-intro-photo"
          src="/images/caleb.webp"
          alt={profileName ? `Photo of ${profileName}` : 'Portrait'}
          width={280}
          height={280}
        />
      </div>
    </div>
  )
}

export default function TVScreen({ profile, screen, noCartridge }) {
  if (noCartridge) {
    return <IntroScreen profileName={profile?.name} />
  }

  if (!screen) return null

  if (screen.type === 'about') {
    return <IntroScreen profileName={profile?.name} />
  }

  if (screen.type === 'project') {
    const p = screen
    return (
      <div className="tv-screen tv-project">
        <div className="tv-project-image" aria-hidden="true">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt="" className="tv-project-img" />
          ) : (
            <span className="tv-project-emoji">{p.imagePlaceholder}</span>
          )}
        </div>
        <h2 className="tv-title">{p.title}</h2>
        <p className="tv-subtitle">{p.subtitle}</p>
        <p className="tv-meta">{p.period} · {p.tech}</p>
        <p className="tv-desc">{p.description}</p>
        {(p.mainRole || p.contributions?.length) && (
          <div className="tv-contrib">
            {p.mainRole && <h3 className="tv-contrib-title">Main Role: {p.mainRole}</h3>}
            {p.contributions?.length > 0 && (
              <ul className="tv-contrib-list">
                {p.contributions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <ul className="tv-highlights">
          {p.highlights?.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        {(p.itchUrl || p.githubUrl) && (
          <div className="tv-project-links">
            {p.itchUrl && (
              <a href={p.itchUrl} target="_blank" rel="noopener noreferrer" className="tv-itch-link">
                Play on itch.io →
              </a>
            )}
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="tv-itch-link">
                View on GitHub →
              </a>
            )}
          </div>
        )}
      </div>
    )
  }

  return null
}
