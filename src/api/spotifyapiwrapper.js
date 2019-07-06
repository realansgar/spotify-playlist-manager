import SpotifyWebApi from "spotify-web-api-js";

const GET_TRACKS_LIMIT = 50;
const GET_PLAYLISTS_LIMIT = 50;
const SEARCH_LIMIT = 10;

var typeNames = {
  artists: "Artists",
  playlists: "Playlists",
  tracks: "Tracks",
  albums: "Albums"
};

const s = new SpotifyWebApi();

async function _getWholePagingUnwrapped(paging, total = paging.total) {
  const result = [...paging.items];
  const requests = [];
  const url = paging.href.substring(0, paging.href.indexOf("?"));
  for (let i = result.length; i < total; i += paging.limit) {
    requests.push(s.getGeneric(`${url}?offset=${i}&limit=${paging.limit}`));
  }
  const pagings = await Promise.all(requests);
  return result.concat(pagings.flatMap(paging => paging.items));
}

s.getWholePlaylistTracks = async function(playlistId, options) {
  const paging = await s.getPlaylistTracks(playlistId, options);
  return _getWholePagingUnwrapped(paging);
};

s.getWholeMySavedTracks = async function(
  options = { limit: GET_TRACKS_LIMIT }
) {
  const paging = await s.getMySavedTracks(options);
  return _getWholePagingUnwrapped(paging);
};

s.getWholeUserPlaylists = async function(
  userId,
  options = { limit: GET_PLAYLISTS_LIMIT }
) {
  const paging = await s.getUserPlaylists(userId, options);
  return _getWholePagingUnwrapped(paging);
};

s.wholeSearch = async function(
  query,
  types = ["playlist", "artist", "album", "track"],
  options = { limit: SEARCH_LIMIT }
) {
  const result = await s.search(query, types, options);
  const typesArr = Object.keys(result);
  const promises = typesArr.map(type =>
    _getWholePagingUnwrapped(result[type], SEARCH_LIMIT)
  );
  const nestedItems = await Promise.all(promises);
  console.log(typesArr);
  return typesArr.map((type, i) => ({
    type: typeNames[type],
    items: nestedItems[i]
  }));
};

export default s;
