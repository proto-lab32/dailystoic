import { useState, useEffect } from 'react'
import './App.css'

const STOIC_QUOTES = [
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.", author: "Epictetus" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "He who fears death will never do anything worthy of a living man.", author: "Seneca" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "We are often more frightened than hurt; and we suffer more from imagination than from reality.", author: "Seneca" },
  { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
  { text: "Caretake this moment. Immerse yourself in its particulars.", author: "Epictetus" },
  { text: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.", author: "Marcus Aurelius" },
  { text: "True happiness is to enjoy the present, without anxious dependence upon the future.", author: "Seneca" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason.", author: "Marcus Aurelius" },
  { text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.", author: "Seneca" },
  { text: "If you want to improve, be content to be thought foolish and stupid.", author: "Epictetus" },
  { text: "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look.", author: "Marcus Aurelius" },
  { text: "Sometimes even to live is an act of courage.", author: "Seneca" },
  { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus" },
  { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", author: "Marcus Aurelius" },
]

function getDailyQuote() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  return STOIC_QUOTES[dayOfYear % STOIC_QUOTES.length]
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function App() {
  const [view, setView] = useState('practice')
  const [activeSection, setActiveSection] = useState('morning')
  const [entries, setEntries] = useState({})
  const [todayEntry, setTodayEntry] = useState({
    morning: {
      challenges: '',
      identity: '',
      perspective: ''
    },
    daytime: {
      situation: '',
      reaction: '',
      reframe: ''
    },
    evening: {
      didWell: '',
      slipped: '',
      tomorrow: '',
      gratitude: ''
    }
  })

  const quote = getDailyQuote()

  useEffect(() => {
    const saved = localStorage.getItem('stoic-journal-entries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed)
      const todayKey = getTodayKey()
      if (parsed[todayKey]) {
        setTodayEntry(parsed[todayKey])
      }
    }
  }, [])

  useEffect(() => {
    const todayKey = getTodayKey()
    const hasContent = Object.values(todayEntry).some(section => 
      Object.values(section).some(val => val.trim() !== '')
    )
    if (hasContent) {
      const updated = { ...entries, [todayKey]: todayEntry }
      setEntries(updated)
      localStorage.setItem('stoic-journal-entries', JSON.stringify(updated))
    }
  }, [todayEntry])

  const updateMorning = (field, value) => {
    setTodayEntry(prev => ({
      ...prev,
      morning: { ...prev.morning, [field]: value }
    }))
  }

  const updateDaytime = (field, value) => {
    setTodayEntry(prev => ({
      ...prev,
      daytime: { ...prev.daytime, [field]: value }
    }))
  }

  const updateEvening = (field, value) => {
    setTodayEntry(prev => ({
      ...prev,
      evening: { ...prev.evening, [field]: value }
    }))
  }

  const exportJournal = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stoic-journal-${getTodayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJournal = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result)
          const merged = { ...entries, ...imported }
          setEntries(merged)
          localStorage.setItem('stoic-journal-entries', JSON.stringify(merged))
          alert('Journal imported successfully!')
        } catch {
          alert('Error importing journal. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const sortedDates = Object.keys(entries).sort((a, b) => new Date(b) - new Date(a))

  return (
    <div className="app">
      <div className="grain-overlay"></div>
      
      <header className="header">
        <div className="header-content">
          <h1 className="logo">STOIC DAILY</h1>
          <nav className="nav">
            <button 
              className={`nav-btn ${view === 'practice' ? 'active' : ''}`}
              onClick={() => setView('practice')}
            >
              Today's Practice
            </button>
            <button 
              className={`nav-btn ${view === 'journal' ? 'active' : ''}`}
              onClick={() => setView('journal')}
            >
              Journal Archive
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {view === 'practice' ? (
          <>
            <section className="quote-section">
              <div className="quote-card">
                <div className="quote-mark">"</div>
                <blockquote className="quote-text">{quote.text}</blockquote>
                <cite className="quote-author">— {quote.author}</cite>
              </div>
              <p className="date-display">{formatDate(new Date())}</p>
            </section>

            <section className="practice-section">
              <div className="section-tabs">
                <button 
                  className={`section-tab ${activeSection === 'morning' ? 'active' : ''}`}
                  onClick={() => setActiveSection('morning')}
                >
                  <span className="tab-icon">🌅</span>
                  <span className="tab-label">Morning</span>
                  <span className="tab-time">5-7 min</span>
                </button>
                <button 
                  className={`section-tab ${activeSection === 'daytime' ? 'active' : ''}`}
                  onClick={() => setActiveSection('daytime')}
                >
                  <span className="tab-icon">🕛</span>
                  <span className="tab-label">Daytime</span>
                  <span className="tab-time">In-moment</span>
                </button>
                <button 
                  className={`section-tab ${activeSection === 'evening' ? 'active' : ''}`}
                  onClick={() => setActiveSection('evening')}
                >
                  <span className="tab-icon">🌙</span>
                  <span className="tab-label">Evening</span>
                  <span className="tab-time">7-10 min</span>
                </button>
              </div>

              <div className="practice-content">
                {activeSection === 'morning' && (
                  <div className="practice-form">
                    <div className="practice-intro">
                      <h2>Morning Practice</h2>
                      <p>Set your mental armor for the day ahead.</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">1</span>
                        <span className="label-title">Premeditatio Malorum</span>
                      </label>
                      <p className="form-prompt">What difficulties might I face today, and how will I meet them calmly?</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="Traffic may be annoying → I will use it to practice patience..."
                        value={todayEntry.morning.challenges}
                        onChange={(e) => updateMorning('challenges', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">2</span>
                        <span className="label-title">Identity Declaration</span>
                      </label>
                      <p className="form-prompt">What kind of person do I plan to be today?</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="A calm presence. A man who thinks before reacting..."
                        value={todayEntry.morning.identity}
                        onChange={(e) => updateMorning('identity', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">3</span>
                        <span className="label-title">Timeline Perspective</span>
                      </label>
                      <p className="form-prompt">What will matter a year from now? What won't?</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="That small setback? Forgettable. How I handled myself? That will matter..."
                        value={todayEntry.morning.perspective}
                        onChange={(e) => updateMorning('perspective', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'daytime' && (
                  <div className="practice-form">
                    <div className="practice-intro">
                      <h2>Daytime Reflection</h2>
                      <p>When life hits, reframe and respond with Stoic wisdom.</p>
                    </div>

                    <div className="stoic-rules">
                      <div className="rule-card">
                        <h4>When irritated</h4>
                        <p>"He's troubled. That's his burden, not mine."</p>
                      </div>
                      <div className="rule-card">
                        <h4>When overwhelmed</h4>
                        <p>"What is the next small action I can do? Just one."</p>
                      </div>
                      <div className="rule-card">
                        <h4>When judged</h4>
                        <p>"Their lens is their problem, not my identity."</p>
                      </div>
                      <div className="rule-card">
                        <h4>When plans fall apart</h4>
                        <p>"Good. A chance to practice flexibility."</p>
                      </div>
                      <div className="rule-card">
                        <h4>When anxious</h4>
                        <p>"Let me deal with the real part—not the imagined part."</p>
                      </div>
                      <div className="rule-card">
                        <h4>When in pain</h4>
                        <p>Pause → Label → "What would my highest self do next?"</p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-title">What happened today?</span>
                      </label>
                      <p className="form-prompt">Describe a situation that tested you.</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="A coworker snapped at me during a meeting..."
                        value={todayEntry.daytime.situation}
                        onChange={(e) => updateDaytime('situation', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-title">How did you react?</span>
                      </label>
                      <textarea 
                        className="form-textarea"
                        placeholder="My initial reaction was... but then I..."
                        value={todayEntry.daytime.reaction}
                        onChange={(e) => updateDaytime('reaction', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-title">The Stoic Reframe</span>
                      </label>
                      <p className="form-prompt">How can you view this through Stoic eyes?</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="He's reacting from his own chaos. I don't have to join his storm..."
                        value={todayEntry.daytime.reframe}
                        onChange={(e) => updateDaytime('reframe', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'evening' && (
                  <div className="practice-form">
                    <div className="practice-intro">
                      <h2>Evening Reflection</h2>
                      <p>Where Stoic rewiring sinks into the nervous system.</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">1</span>
                        <span className="label-title">What did I do well today?</span>
                      </label>
                      <p className="form-prompt">This builds identity.</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="I didn't react to that rude comment. I stayed calm during stress..."
                        value={todayEntry.evening.didWell}
                        onChange={(e) => updateEvening('didWell', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">2</span>
                        <span className="label-title">Where did I slip?</span>
                      </label>
                      <p className="form-prompt">No shame — only measurement.</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="I lost patience. I worried unnecessarily..."
                        value={todayEntry.evening.slipped}
                        onChange={(e) => updateEvening('slipped', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">3</span>
                        <span className="label-title">What will I do differently tomorrow?</span>
                      </label>
                      <p className="form-prompt">Tiny corrections → massive long-term change.</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="Pause before reacting. Speak less emotionally. Reframe quicker..."
                        value={todayEntry.evening.tomorrow}
                        onChange={(e) => updateEvening('tomorrow', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-number">4</span>
                        <span className="label-title">Stoic Gratitude</span>
                      </label>
                      <p className="form-prompt">What was within your control today that you're grateful for?</p>
                      <textarea 
                        className="form-textarea"
                        placeholder="I controlled my reaction. I didn't let fear make decisions. I held my ground..."
                        value={todayEntry.evening.gratitude}
                        onChange={(e) => updateEvening('gratitude', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="save-indicator">
                <span className="save-dot"></span>
                Auto-saved
              </div>
            </section>
          </>
        ) : (
          <section className="journal-section">
            <div className="journal-header">
              <h2>Journal Archive</h2>
              <div className="journal-actions">
                <button className="action-btn" onClick={exportJournal}>
                  Export Journal
                </button>
                <label className="action-btn">
                  Import Journal
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={importJournal}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {sortedDates.length === 0 ? (
              <div className="empty-journal">
                <p>No journal entries yet.</p>
                <p>Start your Stoic practice today.</p>
              </div>
            ) : (
              <div className="journal-entries">
                {sortedDates.map(date => (
                  <JournalEntry key={date} date={date} entry={entries[date]} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Practice daily. Progress inevitably.</p>
      </footer>
    </div>
  )
}

function JournalEntry({ date, entry }) {
  const [expanded, setExpanded] = useState(false)

  const hasContent = (section) => {
    return Object.values(section).some(val => val && val.trim() !== '')
  }

  return (
    <div className={`journal-entry ${expanded ? 'expanded' : ''}`}>
      <button className="entry-header" onClick={() => setExpanded(!expanded)}>
        <span className="entry-date">{formatDate(date)}</span>
        <span className="entry-toggle">{expanded ? '−' : '+'}</span>
      </button>
      
      {expanded && (
        <div className="entry-content">
          {hasContent(entry.morning) && (
            <div className="entry-section">
              <h4>🌅 Morning</h4>
              {entry.morning.challenges && (
                <div className="entry-field">
                  <strong>Anticipated Challenges:</strong>
                  <p>{entry.morning.challenges}</p>
                </div>
              )}
              {entry.morning.identity && (
                <div className="entry-field">
                  <strong>Identity Declaration:</strong>
                  <p>{entry.morning.identity}</p>
                </div>
              )}
              {entry.morning.perspective && (
                <div className="entry-field">
                  <strong>Timeline Perspective:</strong>
                  <p>{entry.morning.perspective}</p>
                </div>
              )}
            </div>
          )}

          {hasContent(entry.daytime) && (
            <div className="entry-section">
              <h4>🕛 Daytime</h4>
              {entry.daytime.situation && (
                <div className="entry-field">
                  <strong>Situation:</strong>
                  <p>{entry.daytime.situation}</p>
                </div>
              )}
              {entry.daytime.reaction && (
                <div className="entry-field">
                  <strong>Reaction:</strong>
                  <p>{entry.daytime.reaction}</p>
                </div>
              )}
              {entry.daytime.reframe && (
                <div className="entry-field">
                  <strong>Stoic Reframe:</strong>
                  <p>{entry.daytime.reframe}</p>
                </div>
              )}
            </div>
          )}

          {hasContent(entry.evening) && (
            <div className="entry-section">
              <h4>🌙 Evening</h4>
              {entry.evening.didWell && (
                <div className="entry-field">
                  <strong>What I Did Well:</strong>
                  <p>{entry.evening.didWell}</p>
                </div>
              )}
              {entry.evening.slipped && (
                <div className="entry-field">
                  <strong>Where I Slipped:</strong>
                  <p>{entry.evening.slipped}</p>
                </div>
              )}
              {entry.evening.tomorrow && (
                <div className="entry-field">
                  <strong>Tomorrow's Focus:</strong>
                  <p>{entry.evening.tomorrow}</p>
                </div>
              )}
              {entry.evening.gratitude && (
                <div className="entry-field">
                  <strong>Stoic Gratitude:</strong>
                  <p>{entry.evening.gratitude}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
