import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/GuestPortal.css';

const GuestPortal = () => {
  const [guestName, setGuestName] = useState('');
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [queue, setQueue] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const socket = io(API_URL);
    
    socket.on('queue-updated', (newQueue) => setQueue(newQueue));
    socket.on('now-playing', (song) => setNowPlaying(song));
    
    return () => socket.disconnect();
  }, []);

  const handleAddSong = async (e) => {
    e.preventDefault();
    
    if (!guestName || !songName || !artist) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/add-song`, {
        guestName,
        songName,
        artist,
        appleMusicId: 'placeholder'
      });
      
      setMessage(`✅ "${songName}" added to queue!`);
      setSongName('');
      setArtist('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding song');
    }
  };

  return (
    <div className="guest-container">
      <div className="wedding-header">
        <div className="monogram">💚</div>
        <h1>Our Wedding Playlist</h1>
        <p className="date">April 30, 2026</p>
      </div>

      <div className="now-playing-section">
        {nowPlaying ? (
          <div className="now-playing">
            <h3>🎵 Now Playing</h3>
            <p className="song-title">{nowPlaying.name}</p>
            <p className="artist">{nowPlaying.artist}</p>
            <p className="requested-by">Requested by: {nowPlaying.requestedBy}</p>
          </div>
        ) : (
          <div className="now-playing">
            <p>No song playing yet...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleAddSong} className="song-form">
        <h2>Request a Song</h2>
        
        <input
          type="text"
          placeholder="Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          maxLength="50"
        />
        
        <input
          type="text"
          placeholder="Song Name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        
        <button type="submit">🎶 Add to Queue</button>
        
        {message && <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}
      </form>

      <div className="queue-section">
        <h2>Coming Up ({queue.length} songs)</h2>
        <div className="queue-list">
          {queue.map((song, index) => (
            <div key={song.id} className="queue-item">
              <span className="queue-number">{index + 1}</span>
              <div className="song-info">
                <p className="song-title">{song.name}</p>
                <p className="artist">{song.artist}</p>
                <p className="requested-by">📌 {song.requestedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestPortal;
