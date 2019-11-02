import SpotifyWebApi from "spotify-web-api-js";

const GET_TRACKS_LIMIT = 50;
const GET_PLAYLISTS_LIMIT = 50;
const SEARCH_LIMIT = 10;

const typeNames = {
  artists: "Artists",
  playlists: "Playlists",
  tracks: "Tracks",
  albums: "Albums",
  user_playlist: "My Playlists"
};

const s = new SpotifyWebApi();

async function _getWholePagingUnwrapped(paging, max) {
  let total = paging.total;
  if (max !== undefined) total = Math.min(paging.total, max);
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
  const searchableTypes = types.filter(x => x !== "user_playlist");
  let returnVal = [];
  if (searchableTypes.length > 0) {
    const result = await s.search(query, searchableTypes, options);
    const typesArr = Object.keys(result);
    const promises = typesArr.map(type =>
      _getWholePagingUnwrapped(result[type], SEARCH_LIMIT)
    );
    const nestedItems = await Promise.all(promises);
    returnVal = typesArr.map((type, i) => ({
      type: typeNames[type],
      items: nestedItems[i]
    }));
  }
  if (types.includes("user_playlist")) {
    let userPlaylists = await s.getWholeUserPlaylists();
    userPlaylists = userPlaylists.filter(
      x =>
        x.name.toLowerCase().includes(query.toLowerCase()) ||
        (x.owner &&
          x.owner.display_name &&
          x.owner.display_name.toLowerCase().includes(query.toLowerCase()))
    );
    returnVal.unshift({
      type: typeNames["user_playlist"],
      items: userPlaylists
    });
  }
  return returnVal;
};

export default s;
