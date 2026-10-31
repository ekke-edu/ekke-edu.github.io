import { useState } from "react";
import ChatDialog from "./components/ChatDialog";
import { content, type Language } from "./content";

const mcpConfiguration = JSON.stringify({
  mcpServers: {
    "ekke-university-assistant": {
      command: "npx",
      args: ["-y", "ekke-mcp"],
      env: { GITHUB_TOKEN: "YOUR_READ_ONLY_TOKEN" },
    },
  },
}, null, 2);

function getSavedLanguage(): Language {
  try {
    return localStorage.getItem("ekke-language") === "en" ? "en" : "hu";
  } catch {
    return "hu";
  }
}

export default function App() {
  const [language, setLanguage] = useState<Language>(getSavedLanguage);
  const [chatOpen, setChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = content[language];

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    try {
      localStorage.setItem("ekke-language", nextLanguage);
    } catch {
      // The selected language remains active for this page view.
    }
  }

  async function copyConfiguration() {
    try {
      await navigator.clipboard.writeText(mcpConfiguration);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <div className="topbar">
        <nav className="wrap nav" aria-label={language === "hu" ? "Fő navigáció" : "Main navigation"}>
          <a className="brand" href="#" aria-label="EKKE-EDU home">
            <img src="/ekke-logo-feher.png" alt="Eszterházy Károly Katolikus Egyetem" />
            <span className="brand-mark" aria-hidden="true" />
            <span>EDU</span>
          </a>
          <div className="nav-right">
            <div className="nav-links">
              {copy.nav.map((label, index) => (
                <a key={label} href={["#courses", "#assistant", "#community"][index]}>{label}</a>
              ))}
            </div>
            <div className="language" aria-label={language === "hu" ? "Nyelvválasztás" : "Language"}>
              {(["hu", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={language === option}
                  onClick={() => changeLanguage(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <header className="hero">
        <div className="wrap hero-inner">
          <div>
            <div className="eyebrow">{copy.heroEyebrow}</div>
            <h1>{copy.heroTitle}</h1>
            <p>{copy.heroBody}</p>
            <div className="actions">
              <a className="button button-primary" href="#courses">
                <span>{language === "hu" ? "Kurzusok felfedezése" : "Explore courses"}</span><span aria-hidden="true">↓</span>
              </a>
              <a className="button button-quiet" href="#assistant">
                <span>{language === "hu" ? "Ismerd meg az MCP-t" : "Discover the MCP"}</span><span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="flow-card" aria-label="EKKE MCP search flow">
            <div className="flow-top"><span>EKKE MCP · SEARCH</span><span className="live">{language === "hu" ? "nyílt források" : "public sources"}</span></div>
            <div className="flow-question">{language === "hu" ? "„Mikor van a tárgyfelvételi időszak?”" : "“When does course registration begin?”"}</div>
            <div className="flow-arrow" aria-hidden="true">↓</div>
            <div className="flow-results">
              <span>{language === "hu" ? "Kurzusok" : "Courses"}</span><span>GitHub<br />Discussions</span><span>{language === "hu" ? "Hivatalos EKKE" : "Official EKKE"}</span>
            </div>
            <div className="flow-caption">{language === "hu" ? "Magyar és angol keresés · forráshivatkozásokkal" : "Hungarian and English search · with source links"}</div>
          </div>
        </div>
      </header>

      <div className="trust-row">
        <div className="wrap trust-inner">
          <strong>{language === "hu" ? "Nyílt anyagok, gyakorlati projektek" : "Open materials, practical projects"}</strong>
          <div className="trust-points">
            <span>{language === "hu" ? "Két nyelven kereshető" : "Search in two languages"}</span>
            <span>{language === "hu" ? "Nyílt forrásokra épül" : "Powered by public sources"}</span>
            <span>{language === "hu" ? "Hallgatóknak és fejlesztőknek" : "For students and developers"}</span>
          </div>
        </div>
      </div>

      <main className="wrap">
        {/* Course cards are data-driven so new teaching material needs one content entry. */}
        <section className="section" id="courses">
          <div className="section-heading">
            <div><p className="kicker">{copy.coursesEyebrow}</p><h2>{copy.coursesTitle}</h2></div>
            <p>{copy.coursesBody}</p>
          </div>
          <div className="course-grid">
            {copy.courses.map(([title, description, code, icon, href]) => (
              <a className="course" href={href} target="_blank" rel="noopener noreferrer" key={code}>
                <div className="course-top"><span className="course-icon">{icon}</span><span className="course-code">{code}</span></div>
                <h3>{title}</h3><p>{description}</p>
                <span className="course-link">{language === "hu" ? "Kurzus megnyitása" : "Open course"} →</span>
              </a>
            ))}
          </div>
        </section>

        {/* MCP setup, safety notes, and the public chat entry point live together. */}
        <section className="section mcp-section" id="assistant">
          <div className="mcp-heading">
            <div><p className="kicker kicker-on-dark">{copy.assistantEyebrow}</p><h2>{copy.assistantTitle}</h2><p>{copy.assistantBody}</p></div>
            <div className="mcp-mark" aria-hidden="true">MCP</div>
          </div>
          <div className="mcp-grid">
            <div className="mcp-benefits">
              {[
                language === "hu" ? "Kurzusrepo-k, publikus issue-k és szervezeti Discussionök keresése." : "Search course repositories, public issues, and organization Discussions.",
                language === "hu" ? "Hivatalos EKKE-oldalak keresése tanulmányi információkhoz." : "Search official EKKE pages for academic information.",
                language === "hu" ? "Magyar és angol keresőkifejezések automatikus bővítése." : "Automatic query expansion between Hungarian and English.",
                language === "hu" ? "Csak nyilvános forrásokat olvas; nem fér hozzá Neptunhoz vagy hallgatói adatokhoz." : "Reads public sources only; it has no access to Neptun or student records.",
              ].map((benefit, index) => <div className="benefit" key={benefit}><b>0{index + 1}</b><span>{benefit}</span></div>)}
            </div>
            <div>
              <div className="code-panel">
                <div className="code-head"><span>mcp.json</span><button className="copy" type="button" onClick={copyConfiguration}>{copied ? copy.copied : copy.copy}</button></div>
                <pre><code>{mcpConfiguration}</code></pre>
              </div>
              <p className="code-note">{language === "hu" ? "A GitHub-token a Discussionök kereséséhez kell. Token nélkül is működik a keresés a kurzusanyagokban és a hivatalos oldalakon." : "A GitHub token is needed for Discussion search. Course materials and official pages remain searchable without it."}</p>
            </div>
          </div>
          <div className="mcp-actions">
            <button className="button button-primary" type="button" onClick={() => setChatOpen(true)}>{copy.chatButton} ✦</button>
            <a className="button button-primary" href="https://www.npmjs.com/package/ekke-mcp" target="_blank" rel="noopener noreferrer">{language === "hu" ? "Csomag az npm-en" : "Package on npm"} ↗</a>
            <a className="button button-quiet" href="https://github.com/ekke-edu/mcp" target="_blank" rel="noopener noreferrer">{language === "hu" ? "Forráskód és útmutató" : "Source and docs"} ↗</a>
          </div>
        </section>

        {/* Community links are kept as a separate section for easy future additions. */}
        <section className="section" id="community">
          <div className="section-heading">
            <div><p className="kicker">{language === "hu" ? "Nyílt együttműködés" : "Open collaboration"}</p><h2>{copy.communityTitle}</h2></div>
            <p>{copy.communityBody}</p>
          </div>
          <div className="org-grid">
            {[
              [language === "hu" ? "EKKE-EDU szervezet" : "EKKE-EDU organization", "https://github.com/ekke-edu"],
              [language === "hu" ? "Kérdések és válaszok" : "Questions and answers", "https://github.com/orgs/ekke-edu/discussions"],
              ["README", "https://github.com/ekke-edu/.github/blob/main/README.md"],
              ["Code of Conduct", "https://github.com/ekke-edu/.github/blob/main/CODE_OF_CONDUCT.md"],
              [language === "hu" ? "Közreműködési útmutató" : "Contributing guide", "https://github.com/ekke-edu/.github/blob/main/CONTRIBUTING.md"],
              ["Security", "https://github.com/ekke-edu/.github/blob/main/SECURITY.md"],
            ].map(([label, href]) => <a className="org-link" href={href} target="_blank" rel="noopener noreferrer" key={href}>{label}<span>↗</span></a>)}
          </div>
        </section>
      </main>

      <button className="chat-launcher" type="button" aria-haspopup="dialog" onClick={() => setChatOpen(true)}>
        ✦ {copy.openChat}
      </button>
      <ChatDialog open={chatOpen} language={language} copy={copy} onClose={() => setChatOpen(false)} />

      <footer><div className="wrap footer-inner"><span>EKKE-EDU · {copy.footer}</span><a href="https://github.com/ekke-edu" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></footer>
    </>
  );
}
