import SpotifyWebApi from "spotify-web-api-js";

const s = new SpotifyWebApi();

async function _getWholePaging(paging) {
  let result = [...paging.items];
  while (result.length < paging.total) {
    paging = await s.getGeneric(paging.next);
    result = [...result, ...paging.items];
  }
  return result;
}

s.getWholePlaylist = async function(playlistId, options) {
  const tracksPaging = await s.getPlaylistTracks(playlistId, options);
  return _getWholePaging(tracksPaging);
};

s.getWholeMySavedTracks = async function (options) {
  const tracksPaging = await s.getMySavedTracks(options);
  return _getWholePaging(tracksPaging);
};

export default s;
