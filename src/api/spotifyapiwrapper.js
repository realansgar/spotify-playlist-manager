import SpotifyWebApi from "spotify-web-api-js";

const GET_TRACKS_LIMIT = 50;
const GET_PLAYLISTS_LIMIT = 50;
const SEARCH_LIMIT = 10;

const typeNames = {
  artists: "Artists",
  playlists: "Playlists",
  tracks: "Tracks",
  albums: "Albums"
};

const s = new SpotifyWebApi();

async function _getWholePagingUnwrapped(paging, total = paging.total) {
  const result = [...paging.items];
  const requests = [];
  const url = new URL(paging.href);
  url.searchParams.set("limit", paging.limit);
  for (let i = result.length; i < total; i += paging.limit) {
    url.searchParams.set("offset", i.toString());
    requests.push(s.getGeneric(url.href));
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
  return typesArr.map((type, i) => ({
    type: typeNames[type],
    items: nestedItems[i]
  }));
};

export default s;
