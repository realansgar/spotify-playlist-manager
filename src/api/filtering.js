import s from "./spotifyapiwrapper";
import { filterSeries, someSeries, everySeries } from "async-es";

function trackEquals(track1, track2) {
  if (track1 === track2) {
    return true;
  }
  if (track1 ? !track2 : track2) {
    return false;
  }
  if (track1.id === track2.id) {
    return true;
  }
  return (
    track1.name === track2.name &&
    track1.artists[0].id === track2.artists[0].id &&
    Math.abs(track1.duration_ms - track2.duration_ms) < 2000
  );
}

const artistCache = {};

async function getArtistTracks(artistId, artistTop) {
  const key = `${artistId}:${!!artistTop}`;
  if (artistCache[key]) return artistCache[key];
  if (artistTop) {
    return s.getWholeArtistTopTracks(artistId);
  }
  const albums = await s.getWholeArtistAlbums(artistId);
  const requests = albums.map(x => s.getWholeAlbumTracks(x.id));
  const result = await Promise.all(requests);
  let tracks = result.flat();
  tracks = tracks.filter(x => x.artists.find(y => y.id === artistId));
  artistCache[key] = tracks;
  return tracks;
}

async function library() {
  return s.getWholeMySavedTracks();
}

async function recentTracks({ limitRecent }) {
  return s.getWholeRecentlyPlayedTracks({ limit: limitRecent });
}

async function topTracksOrArtists({ typeTop, timeRange, limitTop, artistTop }) {
  const options = { time_range: timeRange.id, limit: limitTop };
  if (typeTop.id === "tracks") {
    return s.getWholeMyTopTracks(options);
  } else if (typeTop.id === "artists") {
    const topArtists = await s.getWholeMyTopArtists(options);
    const requests = topArtists.map(x => getArtistTracks(x.id, artistTop));
    const result = await Promise.all(requests);
    return result.flat();
  } else {
    throw `typeTop.id: ${typeTop.id}, should be 'tracks' or 'artists'`;
  }
}

async function search({ item }) {
  switch (item.type) {
    case "track":
      return item;
    case "album":
      return s.getWholeAlbumTracks(item.id);
    case "artist":
      return getArtistTracks(item.id, item.artistTop);
    case "playlist":
      return s.getWholePlaylistTracks(item.id);
    default:
      throw `item.type: ${
        item.type
      }, should be one of 'track', 'album', 'artist', 'playlist'`;
  }
}

const sourceFuncs = {
  library,
  recentTracks,
  topTracksOrArtists,
  search
};

async function getSourceTracks(source) {
  return sourceFuncs[source.sourceType.id](source);
}

async function songIn(track, { source }) {
  const tracks = await getSourceTracks(source);
  return tracks.find(x => trackEquals(track, x));
}

function nameMatch(track, { matchString }) {
  return track.name.match(matchString);
}

function durationMs(track, { min, max }) {
  return min * 1000 <= track.duration_ms < max * 1000;
}

function popularity(track, { min, max }) {
  return min <= track.popularity < max;
}

const filterFuncs = {
  songIn,
  nameMatch,
  durationMs,
  popularity
};

async function getFilterResult(track, filter) {
  if (!filter || !filter.filterType) return true;
  const result = await filterFuncs[filter.filterType.id](track, filter);
  return filter.not ? !result : result;
}

export async function filterTracks(sources, filters, and) {
  const results = sources.map(x => getSourceTracks(x));
  let tracks = await Promise.all(results);
  tracks = tracks.flat();
  tracks = await filterSeries(tracks, async (track, callback) => {
    let result;
    if (and) {
      result = await everySeries(filters, async (filter, innerCallback) => {
        innerCallback(null, await getFilterResult(track, filter));
      });
    } else {
      result = await someSeries(filters, async (filter, innerCallback) => {
        innerCallback(null, await getFilterResult(track, filter));
      });
    }
    callback(null, result);
  });
  return removeDuplicateTracks(tracks);
}

//copied from https://github.com/JMPerez/spotify-dedup/blob/master/app/scripts/deduplicator.js
function removeDuplicateTracks(tracks) {
  const seenIds = {};
  const seenNameAndArtist = {};
  const result = tracks.reduce((remaining, track) => {
    if (!track) return remaining;
    if (!track.id) return remaining;
    let isDuplicate = false;
    const seenNameAndArtistKey = `${track.name}:${track.artists[0].name}`;
    if (track.id in seenIds) {
      // if the two tracks have the same Spotify ID, they are remaining
      isDuplicate = true;
    } else {
      // if they have the same name, main artist, and roughly same duration
      // we consider tem remaining too
      if (
        seenNameAndArtistKey in seenNameAndArtist &&
        Math.abs(seenNameAndArtist[seenNameAndArtistKey] - track.duration_ms) <
          2000
      ) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      remaining.push(track);
      seenIds[track.id] = true;
      seenNameAndArtist[seenNameAndArtistKey] = track.duration_ms;
    }
    return remaining;
  }, []);
  return result;
}

export async function savePlaylist(name, tracks) {
  const playlist = await s.createPlaylistForCurrentUser(name);
  s.addWholeTracksToPlaylist(playlist.id, tracks);
}