// src/components/ui/ArtifactViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import ThreeScene from './ThreeScene';
import { useArtifacts } from '../../context/ArtifactContext';
import { LANGUAGES } from '../../data/artifacts';

/* ─── Tabs ───────────────────────────────────────────────────────── */
const TABS = [
  { id: 'info',     label: 'Info' },
  { id: 'ai',       label: 'AI Analysis' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'chat',     label: 'Chat' },
];

const QUICK_Q = [
  'What materials were used?',
  'Religious significance?',
  'How was it discovered?',
  'Compare with similar artifacts',
];

/* ─── Chat component ─────────────────────────────────────────────── */
const AIChat = ({ artifact }) => {
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: `I am an AI specialist in cultural heritage. Ask me anything about the ${artifact.name}—its history, symbolism, materials, or cultural context.`,
  }]);
  const [input, setInput]   = useState('');
  const [busy, setBusy]     = useState(false);
  const bottomRef           = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = async (text) => {
    const q = text || input;
    if (!q.trim() || busy) return;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);

    /* Placeholder response — replace with real API call in backend phase */
    await new Promise(r => setTimeout(r, 700));
    const responses = {
      material:  `The ${artifact.name} was crafted from ${artifact.material}. This choice of material was not merely practical—it carried deep symbolic significance within ${artifact.culture} society, representing permanence, divine favor, or social status depending on its ritual context.`,
      discover:  `The ${artifact.name} was excavated in the modern era by archaeologists working at the site associated with ${artifact.culture}. The discovery dramatically expanded scholarly understanding of this civilization's artistic and spiritual practices.`,
      religion:  `In ${artifact.culture} religious tradition, the ${artifact.name} played a central ceremonial role. Its imagery draws from cosmological narratives that defined the relationship between the human and divine realms during the ${artifact.period}.`,
      compare:   `The ${artifact.name} shares compositional strategies with contemporary artifacts from neighboring civilizations—particularly in its treatment of the human form and hierarchical scaling. However, its stylistic vocabulary is distinctly ${artifact.culture} in origin.`,
      default:   `The ${artifact.name} (${artifact.era}) stands as one of the defining artistic achievements of ${artifact.culture}. It reflects a sophisticated visual language that encoded theological, political, and aesthetic meaning simultaneously. Is there a specific aspect you'd like to explore further?`,
    };
    const key = q.toLowerCase().includes('material') ? 'material'
              : q.toLowerCase().includes('discover')  ? 'discover'
              : q.toLowerCase().includes('religion') || q.toLowerCase().includes('significance') ? 'religion'
              : q.toLowerCase().includes('compar')   ? 'compare'
              : 'default';

    setMessages(m => [...m, { role: 'ai', text: responses[key] }]);
    setBusy(false);
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="chat-avatar">{m.role === 'ai' ? 'AI' : 'U'}</div>
            <div className="chat-bubble">{m.text}</div>
          </div>
        ))}
        {busy && (
          <div className="chat-msg ai">
            <div className="chat-avatar">AI</div>
            <div className="chat-bubble" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Analyzing…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-quick-btns">
        {QUICK_Q.map((q, i) => (
          <button key={i} className="chat-quick-btn" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask about this artifact…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={busy}
        />
        <button className="chat-send-btn" onClick={() => send()} disabled={busy}>Send</button>
      </div>
    </div>
  );
};

/* ─── Main Viewer ────────────────────────────────────────────────── */
const ArtifactViewer = () => {
  const { viewingArtifact: artifact, closeArtifact, saveArtifact, isSaved } = useArtifacts();
  const [tab,      setTab]      = useState('info');
  const [lang,     setLang]     = useState('en');
  const [viewMode, setViewMode] = useState('3d');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!artifact) return;
    setLoading(true);
    setTab('info');
    setViewMode('3d');
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [artifact?.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && closeArtifact();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!artifact) return null;
  const saved = isSaved(artifact.id);

  return (
    <div className="viewer-modal">
      <div className="viewer-backdrop" onClick={closeArtifact} />
      <div className="viewer-panel">

        {/* ── 3D Viewport ── */}
        <div className="viewer-3d">
          {loading ? (
            <div className="gen-overlay">
              <div className="gen-spinner" />
              <div className="gen-overlay-title">Generating 3D Model…</div>
              <div className="gen-overlay-sub">AI · Mesh Generation · Texture Mapping</div>
            </div>
          ) : (
            <>
              <div className="view-mode-btns">
                {['3D', 'Hologram', 'Wireframe'].map(m => (
                  <button key={m}
                    className={`vm-btn${viewMode === m.toLowerCase() ? ' active' : ''}`}
                    onClick={() => setViewMode(m.toLowerCase())}>
                    {m}
                  </button>
                ))}
              </div>

              <ThreeScene shape={artifact.shape} viewMode={viewMode} key={artifact.id + viewMode} />

              <div className="viewer-controls">
                {['⟲', '⟳', '⊕', '⊖', '⤢'].map((icon, i) => (
                  <div key={i} className="ctrl-btn"
                    title={['Rotate L', 'Rotate R', 'Zoom In', 'Zoom Out', 'Fullscreen'][i]}>
                    {icon}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="viewer-sidebar">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-culture">{artifact.culture}</div>
            <div className="sidebar-title">{artifact.name}</div>
            <div className="sidebar-era">{artifact.era} · {artifact.period}</div>
            <button className="sidebar-close" onClick={closeArtifact} title="Close (Esc)">✕</button>
          </div>

          {/* Language + Save row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 20px', borderBottom: '1px solid var(--border)',
          }}>
            <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <button
              onClick={() => saveArtifact(artifact)}
              style={{
                background: 'none', border: '1px solid var(--border)',
                color: saved ? 'var(--gold)' : 'var(--text-muted)',
                padding: '6px 14px', fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '0.1em',
                transition: 'all 0.3s',
              }}
            >
              {saved ? '♥ Saved' : '♡ Save'}
            </button>
          </div>

          {/* Tabs */}
          <div className="sidebar-tabs">
            {TABS.map(t => (
              <button key={t.id}
                className={`sidebar-tab${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="sidebar-content">
            {tab === 'info' && (
              <>
                <div className="info-block">
                  <div className="info-label">Description</div>
                  <div className="info-value">{artifact.desc}</div>
                </div>
                <div className="info-block">
                  <div className="info-label">Material</div>
                  <div className="info-value">{artifact.material}</div>
                </div>
                <div className="info-block">
                  <div className="info-label">Dimensions</div>
                  <div className="info-value">{artifact.dimensions}</div>
                </div>
                <div className="info-block">
                  <div className="info-label">Location</div>
                  <div className="info-value">📍 {artifact.location}</div>
                </div>
                <div className="info-block">
                  <div className="info-label">Tags</div>
                  <div className="tag-list">
                    {artifact.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'ai' && (
              <>
                <div className="ai-box">
                  <div className="ai-box-header">
                    <div className="ai-pulse" />
                    Semantic Analysis · {LANGUAGES.find(l => l.code === lang)?.label}
                  </div>
                  <p className="ai-box-text">{artifact.aiDesc}</p>
                </div>
                <div className="info-block">
                  <div className="info-label">Cultural Significance</div>
                  <div className="info-value">
                    This artifact represents a pivotal expression of {artifact.culture} civilization,
                    embodying the artistic, spiritual, and social values of the {artifact.period}.
                    Its preservation offers scholars and visitors a direct connection to ancient human experience.
                  </div>
                </div>
                <div className="info-block">
                  <div className="info-label">Collection</div>
                  <div className="info-value">{artifact.collection}</div>
                </div>
              </>
            )}

            {tab === 'timeline' && (
              <div className="timeline">
                {artifact.timeline.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-date">{item.date}</div>
                    <div className="timeline-text">{item.text}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'chat' && <AIChat artifact={artifact} key={artifact.id} />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArtifactViewer;