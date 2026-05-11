import './TopScreen.css'
import { resolveAssetUrl } from '../utils/assetUrl'

const INTRO_PARA_1 =
  "Hello! I'm 24 years old game developer / producer with a degree in Game Design and Development from RIT."

const INTRO_PARA_2 =
  "My skill sets include, but is not limited to C# and C++ programming, Project Management using Agile and Waterfall, Jira, Scrum, and more. To check out my projects, click one of the cartridges to learn more!"

function IntroScreen({ profileName }) {
  return (
    <div className="top-screen top-intro-split">
      <div className="top-intro-copy">
        <p className="top-intro-body">{INTRO_PARA_1}</p>
        <p className="top-intro-body top-intro-body--after-break">{INTRO_PARA_2}</p>
      </div>
      <div className="top-intro-photo-wrap">
        <img
          className="top-intro-photo"
          src={resolveAssetUrl('/images/caleb.webp')}
          alt={profileName ? `Photo of ${profileName}` : 'Portrait'}
          width={280}
          height={280}
        />
      </div>
    </div>
  )
}

export default function TopScreen({ profile, screen, noCartridge }) {
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
      <div className="top-screen top-project">
        <div className="top-project-image" aria-hidden="true">
          {p.imageUrl ? (
            <img src={resolveAssetUrl(p.imageUrl)} alt="" className="top-project-img" />
          ) : (
            <span className="top-project-emoji">{p.imagePlaceholder}</span>
          )}
        </div>
        <h2 className="top-title">{p.title}</h2>
        <p className="top-subtitle">{p.subtitle}</p>
        <p className="top-meta">{p.period} · {p.tech}</p>
        <p className="top-desc">{p.description}</p>
        {(p.mainRole || p.contributions?.length) && (
          <div className="top-contrib">
            {p.mainRole && <h3 className="top-contrib-title">Main Role: {p.mainRole}</h3>}
            {p.contributions?.length > 0 && (
              <ul className="top-contrib-list">
                {p.contributions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <ul className="top-highlights">
          {p.highlights?.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        {(p.itchUrl || p.githubUrl || p.websiteUrl) && (
          <div className="top-project-links">
            {p.websiteUrl && (
              <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="top-link">
                Visit website →
              </a>
            )}
            {p.itchUrl && (
              <a href={p.itchUrl} target="_blank" rel="noopener noreferrer" className="top-link">
                Play on itch.io →
              </a>
            )}
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="top-link">
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
