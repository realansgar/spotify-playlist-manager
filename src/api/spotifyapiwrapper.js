import SpotifyWebApi from "spotify-web-api-js";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  minTime: 200,
  maxConcurrent: 3
});

const limited = {};

const GET_TRACKS_LIMIT = 50;
const GET_ALBUMS_LIMIT = 20;
const GET_ARTISTS_LIMIT = 50;
const GET_ARTIST_ALBUMS_LIMIT = 50;
const GET_PLAYLISTS_LIMIT = 50;
const SEARCH_LIMIT = 10;
const LIMITS = {
  track: GET_TRACKS_LIMIT,
  album: GET_ALBUMS_LIMIT,
  artist: GET_ARTISTS_LIMIT
};

const typeNames = {
  artists: "Artists",
  playlists: "Playlists",
  tracks: "Tracks",
  albums: "Albums",
  user_playlist: "My Playlists"
};

const spotifyCache = {
  library: null,
  recentlyPlayedTracks: null,
  user: null
};

const s = new SpotifyWebApi();

for (const key in s) {
  limited[key] = limiter.wrap(s[key]);
}

window.s = s;
window.limiter = limiter;

const GET_MULTIPLE = {
  track: limited.getTracks,
  album: limited.getAlbums,
  artist: limited.getArtists
};

async function _getMeCached() {
  if (!spotifyCache.user) {
    spotifyCache.user = await limited.getMe();
  }
  return spotifyCache.user;
}

async function _getWholePagingUnwrapped(paging, max) {
  let total = paging.total;
  if (max !== undefined) total = Math.min(paging.total, max);
  const result = [...paging.items];
  const requests = [];
  const url = new URL(paging.href);
  url.searchParams.set("limit", paging.limit);
  for (let i = result.length; i < total; i += paging.limit) {
    url.searchParams.set("offset", i.toString());
    requests.push(limited.getGeneric(url.href));
  }
  const pagings = await Promise.all(requests);
  return result.concat(pagings.flatMap(paging => paging.items));
}

async function _getFullObjects(array) {
  const requestIdLists = { album: [], artist: [], track: [] };
  const requests = [];
  let result = [];
  for (const item of array) {
    if (spotifyCache[item.uri]) {
      result.push(spotifyCache[item.uri]);
    } else {
      requestIdLists[item.type].push(item.id);
    }
  }
  for (const key of Object.keys(requestIdLists)) {
    for (let i = 0; i < requestIdLists[key].length; i += LIMITS[key]) {
      const ids = requestIdLists[key].slice(i, i + LIMITS[key]);
      requests.push(GET_MULTIPLE[key](ids));
    }
  }
  const responses = await Promise.all(requests);
  result = result.concat(responses.flatMap(x => Object.values(x)[0]));
  result.forEach(item => (spotifyCache[item.uri] = item));
  return result;
}

s.getWholeRecentlyPlayedTracks = async function(options = {}) {
  try {
    if (!options.limit) options.limit = GET_TRACKS_LIMIT;
    if (!spotifyCache.recentlyPlayedTracks) {
      const paging = await limited.getMyRecentlyPlayedTracks(options);
      let simpleRecentlyPlayedTracks = await _getWholePagingUnwrapped(
        paging,
        options.limit
      );
      simpleRecentlyPlayedTracks = simpleRecentlyPlayedTracks.map(x => x.track);
      spotifyCache.recentlyPlayedTracks = await _getFullObjects(
        simpleRecentlyPlayedTracks
      );
    }
    return spotifyCache.recentlyPlayedTracks;
  } catch (e) {
    if (e.status === 403) {
      e.reason = "userReadRecentlyPlayed";
    }
    throw e;
  }
};

s.getWholePlaylistTracks = async function(playlistId, options) {
  const paging = await limited.getPlaylistTracks(playlistId, options);
  const result = await _getWholePagingUnwrapped(paging);
  const playlistTracks = result.filter(x => !x.isLocal);
  return playlistTracks.map(x => x.track);
};

s.getWholeMySavedTracks = async function(options) {
  try {
    if (!spotifyCache.library) {
      const paging = await limited.getMySavedTracks(options);
      const savedTracks = await _getWholePagingUnwrapped(paging);
      spotifyCache.library = savedTracks.map(x => x.track);
    }
    return spotifyCache.library;
  } catch (e) {
    if (e.status === 403) {
      e.reason = "userLibraryRead";
    }
    throw e;
  }
};

s.getWholeUserPlaylists = async function(
  userId,
  options = { limit: GET_PLAYLISTS_LIMIT }
) {
  const paging = await limited.getUserPlaylists(userId, options);
  return _getWholePagingUnwrapped(paging);
};

s.getWholeMyTopTracks = async function(options = {}) {
  try {
    if (!options.limit) options.limit = GET_TRACKS_LIMIT;
    const paging = await limited.getMyTopTracks(options);
    return _getWholePagingUnwrapped(paging, options.limit);
  } catch (e) {
    if (e.status === 403) {
      e.reason = "userTopRead";
    }
    throw e;
  }
};

s.getWholeMyTopArtists = async function(options = {}) {
  try {
    if (!options.limit) options.limit = GET_ARTISTS_LIMIT;
    const paging = await limited.getMyTopArtists(options);
    return _getWholePagingUnwrapped(paging, options.limit);
  } catch (e) {
    if (e.status === 403) {
      e.reason = "userTopRead";
    }
    throw e;
  }
};

s.getWholeArtistTopTracks = async function(artistId, countryCode, options) {
  if (!countryCode) {
    const user = await _getMeCached();
    countryCode = user.country;
  }
  const result = await limited.getArtistTopTracks(artistId, countryCode, options);
  return result.tracks;
};

s.getWholeArtistAlbums = async function(artistId, options = {}) {
  options.limit = GET_ARTIST_ALBUMS_LIMIT;
  const paging = await limited.getArtistAlbums(artistId, options);
  return _getWholePagingUnwrapped(paging);
};

s.getWholeAlbumTracks = async function(albumId, options = {}) {
  options.limit = GET_TRACKS_LIMIT;
  const paging = await limited.getAlbumTracks(albumId, options);
  const result = await _getWholePagingUnwrapped(paging);
  return _getFullObjects(result);
};

s.wholeSearch = async function(
  query,
  types = ["playlist", "artist", "album", "track"],
  options = { limit: SEARCH_LIMIT }
) {
  let searchableTypes = types.filter(x => x !== "user_playlist");
  let returnVal = [];
  if (searchableTypes.length > 0) {
    const result = await s.search(query, searchableTypes, options);
    searchableTypes = searchableTypes.map(x => `${x}s`);
    const typesArr = searchableTypes.filter(x =>
      Object.keys(result).includes(x)
    );
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
    let userPlaylists = await limited.getWholeUserPlaylists();
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

s.createPlaylistForCurrentUser = async function(name) {
  const user = await _getMeCached();
  return limited.createPlaylist(user.id, { name });
};

s.addWholeTracksToPlaylist = async function(playlistId, tracks) {
  tracks = tracks.map(x => x.uri);
  for (let i = 0; i < tracks.length; i += 100) {
    await limited.addTracksToPlaylist(playlistId, tracks.slice(i, i + 100));
  }
};

export default s;
