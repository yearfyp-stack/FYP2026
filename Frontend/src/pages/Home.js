// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import ArtifactCard from '../components/ui/ArtifactCard';
import ArtifactViewer from '../components/ui/ArtifactViewer';
import GeneratingState from '../components/ui/GeneratingState';
import { useArtifacts } from '../context/ArtifactContext';
import { ARTIFACTS } from '../data/artifacts';

const QUICK_TAGS = ['Egypt', 'Greece', 'Maya', 'China', 'Rome', 'Indus Valley', 'Mesopotamia', 'Japan'];
const FEATURED = ARTIFACTS.filter(a => a.featured);

const Home = () => {
  const { viewingArtifact } = useArtifacts();
  const [isSearching,   setIsSearching]   = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    setSearchResults(null);

    setTimeout(() => {
      const q = query.toLowerCase();
      const results = ARTIFACTS.filter(a =>
        a.name.toLowerCase().includes(q)    ||
        a.culture.toLowerCase().includes(q) ||
        a.era.toLowerCase().includes(q)     ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
      setSearchResults(results.length ? results : ARTIFACTS.slice(0, 4));
      setIsSearching(false);
    }, 2600);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />

        <div className="hero-eyebrow">Cultural Heritage · 3D Explorer · AI-Powered</div>

        <h1 className="hero-title">
          <span className="t1">Millennia of<br /></span>
          <span className="t2">Human Genius</span>
          <span className="t3"><br />in 3D</span>
        </h1>

        <p className="hero-subtitle">
          Discover ancient artifacts through AI-generated three-dimensional models
          enriched with scholarly descriptions and multilingual context.
        </p>

        <SearchBar onSearch={handleSearch} />

        <div className="hero-tags">
          {QUICK_TAGS.map(tag => (
            <button key={tag} className="hero-tag" onClick={() => handleSearch(tag)}>
              {tag}
            </button>
          ))}
        </div>

        <div className="stats-bar">
          {[
            ['12K+', 'Artifacts'],
            ['47',   'Civilizations'],
            ['6',    'Languages'],
            ['AI',   'Powered'],
          ].map(([num, label]) => (
            <div key={label} className="stat-item">
              <span className="stat-num">{num}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH RESULTS ── */}
      {(isSearching || searchResults) && (
        <section className="search-results-section">
          {isSearching ? (
            <GeneratingState query={searchQuery} />
          ) : (
            <>
              <div style={{ marginBottom: 36 }}>
                <div className="results-eyebrow">Search Results</div>
                <div className="results-title">
                  Results for <span>"{searchQuery}"</span>
                </div>
                <div className="results-count">
                  {searchResults.length} artifact{searchResults.length !== 1 ? 's' : ''} found · AI-generated 3D models
                </div>
              </div>
              <div className="artifact-grid">
                {searchResults.map(a => <ArtifactCard key={a.id} artifact={a} />)}
              </div>
            </>
          )}
        </section>
      )}

      {/* ── FEATURED COLLECTION ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured <span>Collection</span></h2>
          <Link to="/explore" className="section-link">View all artifacts →</Link>
        </div>
        <div className="artifact-grid">
          {FEATURED.map(a => <ArtifactCard key={a.id} artifact={a} />)}
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="section" style={{ background: 'var(--deep)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-header">
          <h2 className="section-title">Platform <span>Features</span></h2>
          <Link to="/about" className="section-link">Learn more →</Link>
        </div>
        <div className="features-grid">
          {[
            { icon: '◈', title: 'AI 3D Generation',      desc: 'Diffusion models generate photorealistic 3D meshes from historical descriptions and reference imagery.' },
            { icon: '⟁', title: 'Semantic Descriptions', desc: 'LLMs provide rich contextual analysis—historical significance, symbolic meaning, material culture.' },
            { icon: '❊', title: 'Multilingual Access',   desc: 'Every description and AI conversation available in English, French, Arabic, Chinese, Spanish, and Hindi.' },
            { icon: '◉', title: 'Holographic Viewing',   desc: 'Export models to holographic display formats for museum installations and immersive experiences.' },
            { icon: '⬡', title: 'Conversational AI',     desc: 'Chat with an AI specialist about any artifact—techniques, history, symbolism, or comparative analysis.' },
            { icon: '⊛', title: 'Scholar Verified',      desc: 'Descriptions are linked to academic sources, bridging AI generation and expert scholarship.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-num">{String(i + 1).padStart(2, '0')}</div>
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Viewer Modal */}
      {viewingArtifact && <ArtifactViewer />}
    </>
  );
};

export default Home;