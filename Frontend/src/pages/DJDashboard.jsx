import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DJDashboard.css';

const DJDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [djPassword, setDjPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthenticated(true);
    loadQueue();
  };

  const loadQueue = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dj/queue?password=${djPassword}`);
      setQueue(response.data.queue);
      setNowPlaying(response.data.nowPlaying);
    } catch (error) {
      alert('Invalid password');
      setAuthenticated(false);
    }
  };

  const handleSkip = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/dj/skip`, { password: djPassword });
      setNowPlaying(response.data.nowPlaying);
      setQueue(response.data.queue);
    } catch (error) {
      alert('Error skipping song');
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/dj/song/${songId}?password=${djPassword}`);
      setQueue(response.data.queue);
    } catch (error) {
      alert('Error removing song');
    }
  };

  if (!authenticated) {
    return (
      <div className="dj-login">
        <h1>🎧 DJ Control Panel</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter DJ Password"
            value={djPassword}
            onChange={(e) => setDjPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dj-dashboard">
      <h1>🎧 DJ Control Panel</h1>

      <div className="now-playing-control">
        <h2>Now Playing</h2>
        {nowPlaying ? (
          <div className="current-song">
            <p className="song-title">{nowPlaying.name}</p>
            <p className="artist">{nowPlaying.artist}</p>
            <button onClick={handleSkip} className="skip-btn">⏭️ Skip to Next</button>
          </div>
        ) : (
          <p>No song playing</p>
        )}
      </div>

      <div className="queue-control">
        <h2>Queue ({queue.length})</h2>
        <div className="queue-list">
          {queue.map((song, index) => (
            <div key={song.id} className="queue-item-control">
              <span className="position">{index + 1}</span>
              <div className="song-info">
                <p>{song.name} - {song.artist}</p>
                <p className="requested-by">by {song.requestedBy}</p>
              </div>
              <button onClick={() => handleRemoveSong(song.id)} className="remove-btn">❌</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DJDashboard;
