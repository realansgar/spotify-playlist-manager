import s from "./spotifyapiwrapper";

async function getArtistTracks(artistId, artistTop) {
  if (artistTop) {
    const user = await s.getMe();
    const result = await s.getWholeArtistTopTracks(artistId, user.country);
    return result.tracks;
  }
  const albums = await s.getWholeArtistAlbums(artistId);
  const requests = albums.map(x => s.getWholeAlbumTracks(x.id));
  const result = await Promise.all(requests);
  const tracks = result.flat();
  return tracks.filter(x => x.artists.find(y => y.id === artistId));
}

async function library() {
  return s.getWholeMySavedTracks();
}

async function recentTracks({ limitRecent }) {
  return s.getWholeRecentlyPlayedTracks({ limit: limitRecent });
}

async function topTracksOrArtists({ typeTop, timeRange, limitTop, artistTop }) {
  const options = { time_range: timeRange, limit: limitTop };
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

async function search({ item, artistTop }) {
  switch (item.type) {
    case "track":
      return item;
    case "album":
      return s.getWholeAlbumTracks(item.id);
    case "artist":
      return getArtistTracks(item.id, artistTop);
    case "playlist":
      return s.getWholePlaylistTracks(item.id);
    default:
      throw `item.type: ${item.type}, should be one of 'track', 'album', 'artist', 'playlist'`;
  }
}

function equals(track1, track2) {
  if (track1 === track2) {
    return true;
  }
  if (track)
  if (track1.id === track2.id) {
    return true;
  }
}

async function songIn(track, { source }) {

}

const sourceFuncs = {
  library,
  recentTracks,
  topTracksOrArtists,
  search
};

const filterFuncs = {
  songIn
};

//copied from https://github.com/JMPerez/spotify-dedup/blob/master/app/scripts/deduplicator.js
function findDuplicatedTracks(tracks) {
  const seenIds = {};
  const seenNameAndArtist = {};
  const result = tracks.reduce((duplicates, track, index) => {
    if (track === null) return duplicates;
    if (track.id === null) return duplicates;
    let isDuplicate = false;
    const seenNameAndArtistKey = `${track.name}:${track.artists[0].name}`;
    if (track.id in seenIds) {
      // if the two tracks have the same Spotify ID, they are duplicates
      isDuplicate = true;
    } else {
      // if they have the same name, main artist, and roughly same duration
      // we consider tem duplicates too
      if (
        seenNameAndArtistKey in seenNameAndArtist &&
        Math.abs(
          seenNameAndArtist[seenNameAndArtistKey] - track.duration_ms
        ) < 2000
      ) {
        isDuplicate = true;
      }
    }
    if (isDuplicate) {
      duplicates.push({
        index: index,
        track: track,
        reason: track.id in seenIds ? 'same-id' : 'same-name-artist',
      });
    } else {
      seenIds[track.id] = true;
      seenNameAndArtist[seenNameAndArtistKey] = track.duration_ms;
    }
    return duplicates;
  }, []);
  return result;
}