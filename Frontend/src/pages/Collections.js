// src/pages/Collections.jsx
import React, { useState } from 'react';
import { useArtifacts } from '../context/ArtifactContext';
import ArtifactCard from '../components/ui/ArtifactCard';
import ArtifactViewer from '../components/ui/ArtifactViewer';
import { COLLECTIONS, ARTIFACTS } from '../data/artifacts';

const Collections = () => {
  const { viewingArtifact } = useArtifacts();
  const [activeCollection, setActiveCollection] = useState(null);

  const collectionArtifacts = activeCollection
    ? ARTIFACTS.filter(a => a.collection === activeCollection.name)
    : [];

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-eyebrow">Artefactum · Collections</div>
        <h1 className="page-title">Curated <span>Collections</span></h1>
        <p className="page-subtitle">
          Thematic groups of artifacts organized by civilization, period, and cultural tradition.
        </p>
      </div>

      {/* Collection Grid */}
      {!activeCollection && (
        <section className="section">
          <div className="collection-grid">
            {COLLECTIONS.map(col => (
              <div key={col.id} className="collection-card" onClick={() => setActiveCollection(col)}>
                <div className="cc-visual">
                  {col.icons.map((icon, i) => (
                    <div key={i} className="cc-thumb">{icon}</div>
                  ))}
                  <div className="cc-overlay">
                    <button className="card-explore-btn" style={{ width: 'auto', padding: '10px 28px' }}>
                      Browse Collection
                    </button>
                  </div>
                  <span className="cc-count">{col.count} artifacts</span>
                </div>
                <div className="cc-body">
                  <div className="cc-culture">{col.culture}</div>
                  <div className="cc-title">{col.name}</div>
                  <p className="cc-desc">{col.desc}</p>
                </div>
                <div className="cc-footer">
                  <span className="cc-meta">{col.era}</span>
                  <button className="cc-btn">Explore →</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Collection Detail */}
      {activeCollection && (
        <section className="section">
          <div className="section-header">
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--gold-dim)', letterSpacing: '0.15em', marginBottom: 8 }}>
                {activeCollection.culture}
              </div>
              <h2 className="section-title">{activeCollection.name}</h2>
            </div>
            <button
              onClick={() => setActiveCollection(null)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '8px 18px',
                fontFamily: "'Cinzel', serif",
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
              ← All Collections
            </button>
          </div>

          <p style={{ fontSize: 16, color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: 40, maxWidth: 600 }}>
            {activeCollection.desc}
          </p>

          {collectionArtifacts.length > 0 ? (
            <div className="artifact-grid">
              {collectionArtifacts.map(a => <ArtifactCard key={a.id} artifact={a} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <div className="empty-title">More artifacts coming soon</div>
              <p className="empty-desc">This collection is being digitized and will be available shortly.</p>
            </div>
          )}
        </section>
      )}

      {/* Saved Artifacts */}
      <SavedSection />

      {viewingArtifact && <ArtifactViewer />}
    </>
  );
};

const SavedSection = () => {
  const { savedArtifacts, viewingArtifact } = useArtifacts();
  if (!savedArtifacts.length) return null;

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="section-header">
        <h2 className="section-title">Your <span>Saved</span> Artifacts</h2>
        <span className="section-meta">{savedArtifacts.length} saved</span>
      </div>
      <div className="artifact-grid">
        {savedArtifacts.map(a => <ArtifactCard key={a.id} artifact={a} />)}
      </div>
    </section>
  );
};

export default Collections;