'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { musicTracks } from '../data/music';

const sidebarItems = ['Home', 'Search', 'Library', 'Liked Songs'];

function formatTime(totalSeconds: number) {
  const safe = Number.isFinite(totalSeconds) ? totalSeconds : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function Page() {
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = musicTracks[currentIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.audio;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return;
    if (isPlaying) {
      node.play().catch(() => setIsPlaying(false));
    } else {
      node.pause();
    }
  }, [isPlaying]);

  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleContinueWithoutGoogle = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleTimeUpdate = () => {
    const node = audioRef.current;
    if (!node || !node.duration) return;
    const value = (node.currentTime / node.duration) * 100;
    setProgress(Number.isFinite(value) ? value : 0);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % musicTracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const nextIndex = currentIndex - 1 < 0 ? musicTracks.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIndex);
    setProgress(0);
    setIsPlaying(true);
  };

  const heroTracks = useMemo(() => musicTracks.slice(0, 4), []);

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} preload="metadata" />

      {isAuthOpen && !isLoggedIn && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="auth-brand">SPOTIBAI</div>
            <h2>Log in to your music world</h2>
            <p>Use your Google account or continue without it.</p>
            <button className="google-button" onClick={handleGoogleLogin}>
              Continue with Google
            </button>
            <button className="ghost-button" onClick={handleContinueWithoutGoogle}>
              Continue without Google
            </button>
          </div>
        </div>
      )}

      <div className="spotify-shell">
        <aside className="sidebar">
          <div className="logo-wrap">
            <div className="logo-icon">S</div>
          </div>

          <nav className="nav-stack">
            {sidebarItems.map((item, index) => (
              <button key={item} className={`nav-link ${index === 0 ? 'active' : ''}`}>
                {item}
              </button>
            ))}
          </nav>

          <div className="mini-profile">
            <div className="avatar avatar-small" />
            <div>
              <strong>Magkabilang Mundo</strong>
              <small>Direm Lim</small>
            </div>
          </div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input type="text" value="What do you want to play?" readOnly />
            </div>
          </header>

          <section className="hero-card" style={{ background: `linear-gradient(135deg, ${currentTrack.accent}, #151515 60%)` }}>
            <div className="hero-visual">
              <img src={currentTrack.cover} alt={currentTrack.title} />
            </div>
            <div className="hero-copy">
              <span className="eyebrow">Public Playlist</span>
              <h1>{currentTrack.title}</h1>
              <p>{currentTrack.artist}</p>
              <div className="meta-row">
                <span>Made for you</span>
                <span>•</span>
                <span>5 songs</span>
              </div>
            </div>
          </section>

          <div className="controls-row">
            <button className="play-button" onClick={() => setIsPlaying((value) => !value)}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button className="icon-button">◌</button>
            <button className="icon-button">＋</button>
            <button className="icon-button">⋯</button>
          </div>

          <section className="track-table-wrap">
            <table className="track-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Album</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {musicTracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className={index === currentIndex ? 'active-row' : ''}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <td>{track.id}</td>
                    <td>
                      <div className="track-cell">
                        <img src={track.cover} alt={track.title} />
                        <div>
                          <strong>{track.title}</strong>
                          <small>{track.artist}</small>
                        </div>
                      </div>
                    </td>
                    <td>{track.album}</td>
                    <td>{track.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>

        <aside className="right-panel">
          <div className="panel-card">
            <img src={currentTrack.cover} alt={currentTrack.title} className="panel-art" />
            <div className="panel-title-row">
              <div>
                <span className="mini-label">SPOTIBAI</span>
                <h3>{currentTrack.title}</h3>
              </div>
              <div className="panel-icons">✕</div>
            </div>
          </div>

          <div className="artist-card">
            <div className="artist-header">
              <div className="avatar avatar-large" />
              <div>
                <h4>{currentTrack.artist}</h4>
                <p>5,769,502 monthly listeners</p>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <div className="social-links">
              <span>Social media links:</span>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
                YouTube
              </a>
            </div>
          </div>
        </aside>
      </div>

      <footer className="player-bar">
        <div className="now-playing">
          <img src={currentTrack.cover} alt={currentTrack.title} />
          <div>
            <strong>{currentTrack.title}</strong>
            <small>{currentTrack.artist}</small>
          </div>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button onClick={handlePrevious}>⏮</button>
            <button className="play-mid" onClick={() => setIsPlaying((value) => !value)}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button onClick={handleNext}>⏭</button>
          </div>
          <div className="progress-line">
            <span>{formatTime(audioRef.current?.currentTime ?? 0)}</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
