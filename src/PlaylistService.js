const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId, owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
      FROM playlists p 
      LEFT JOIN 
        users u ON p.owner = u.id 
      LEFT JOIN
        collaborations c ON p.id = c.playlist_id
      WHERE p.id = $1 AND (c.user_id = $2 OR p.owner = $2)
      GROUP BY
        p.id, p.name, u.username`,
      values: [playlistId, owner],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT s.id, s.title, s.performer FROM songs s JOIN playlist_songs ps ON s.id = ps.song_id WHERE playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistService;
