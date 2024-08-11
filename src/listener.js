class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;
  }

  async listen(message) {
    try {
      const { userId, playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlist = await this._playlistService.getPlaylistById(playlistId, userId);
      const songs = await this._playlistService.getSongsByPlaylistId(playlistId);
      playlist.songs = songs;
      await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
      console.log(playlist);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
