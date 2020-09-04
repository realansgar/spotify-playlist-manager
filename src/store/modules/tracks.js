const state = {
  resultTracks: [],
  playlistName: "",
  playlistObject: null
};

const mutations = {
  setResultTracks(state, { tracks }) {
    state.resultTracks = tracks;
  },
  setPlaylistName(state, { name }) {
    state.playlistName = name;
  },
  setPlaylistObject(state, { playlist }) {
    state.playlistObject = playlist;
  }
};

export default { namespaced: true, state, mutations };
