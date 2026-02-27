// src/pages/Explore.jsx
import React, { useState, useMemo } from 'react';
import ArtifactCard from '../components/ui/ArtifactCard';
import ArtifactViewer from '../components/ui/ArtifactViewer';
import SearchBar from '../components/ui/SearchBar';
import GeneratingState from '../components/ui/GeneratingState';
import { useArtifacts } from '../context/ArtifactContext';
import { ARTIFACTS, CULTURES, CATEGORIES } from '../data/artifacts';

const SORT_OPTIONS = [
  { value: 'default',  label: 'Default' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'era_asc',  label: 'Oldest First' },
  { value: 'era_desc', label: 'Newest First' },
];

const Explore = () => {
  const { viewingArtifact }          = useArtifacts();
  const [culture,  setCulture]        = useState('All');
  const [category, setCategory]       = useState('All');
  const [sort,     setSort]           = useState('default');
  const [gridView, setGridView]       = useState(true);
  const [isSearching,   setIsSearching]   = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    setSearchResults(null);
    setTimeout(() => {
      const q = query.toLowerCase();
      const r = ARTIFACTS.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.culture.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
      setSearchResults(r.length ? r : ARTIFACTS);
      setIsSearching(false);
    }, 2200);
  };

  const clearSearch = () => { setSearchResults(null); setSearchQuery(''); };

  const displayed = useMemo(() => {
    let list = searchResults || ARTIFACTS;
    if (culture  !== 'All') list = list.filter(a => a.culture  === culture);
    if (category !== 'All') list = list.filter(a => a.category === category);
    switch (sort) {
      case 'name_asc':  return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'era_asc':   return [...list].sort((a, b) => parseInt(a.era) - parseInt(b.era));
      case 'era_desc':  return [...list].sort((a, b) => parseInt(b.era) - parseInt(a.era));
      default:          return list;
    }
  }, [searchResults, culture, category, sort]);

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-eyebrow">Artefactum · Explore</div>
        <h1 className="page-title">Explore <span>All Artifacts</span></h1>
        <p className="page-subtitle">
          Browse the full collection of AI-modeled cultural heritage artifacts from civilizations across time.
        </p>
        <div style={{ marginTop: 32, maxWidth: 600 }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        {/* Culture filters */}
        <div className="filter-group">
          {CULTURES.map(c => (
            <button key={c}
              className={`filter-btn${culture === c ? ' active' : ''}`}
              onClick={() => setCulture(c)}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Category */}
          <select className="sort-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sort */}
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Grid/List toggle */}
          <div className="view-toggle">
            <button className={`vt-btn${gridView ? ' active' : ''}`}  onClick={() => setGridView(true)}  title="Grid">⊞</button>
            <button className={`vt-btn${!gridView ? ' active' : ''}`} onClick={() => setGridView(false)} title="List">≡</button>
          </div>
        </div>
      </div>

      {/* Results info */}
      {searchResults && (
        <div style={{ padding: '16px 48px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
            Showing results for "{searchQuery}" · {displayed.length} found
          </span>
          <button onClick={clearSearch} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em' }}>
            Clear Search
          </button>
        </div>
      )}

      {/* Content */}
      <div className="section" style={{ paddingTop: 40 }}>
        {isSearching ? (
          <GeneratingState query={searchQuery} />
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">No artifacts found</div>
            <p className="empty-desc">Try adjusting your filters or search for a different civilization or period.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
                {displayed.length} artifact{displayed.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`artifact-grid${gridView ? '' : ' cols-4'}`}>
              {displayed.map(a => <ArtifactCard key={a.id} artifact={a} />)}
            </div>
          </>
        )}
      </div>

      {viewingArtifact && <ArtifactViewer />}
    </>
  );
};

export default Explore;