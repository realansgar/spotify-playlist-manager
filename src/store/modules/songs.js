import s from "../../api/spotifyapiwrapper";

const state = {
  s,
  userPlaylists: [],
  spotifyObjects: {}
};

const mutations = {
  setSpotifyObject(state, { object }) {
    const { type, id } = object;
    if (!state[type]) state[type] = {};
    state[type][id] = object;
  },
  setUserPlaylists(state, { playlists }) {
    state.userPlaylists = playlists;
  }
};

const getters = {
  getSpotifyObject: state => (type, id) =>
    state.spotifyObjects[type] ? state.spotifyObjects[type][id] : undefined,
  searchUserPlaylists: state => query =>
    state.userPlaylists.findAll(playlist =>
      playlist.name.toLowerCase().includes(query.toLowerCase())
    )
};

const actions = {
  setSpotifyObjects({ commit }, { objects }) {
    for (const object of objects) {
      commit("setSpotifyObject", { object });
    }
  },
  async getUserPlaylists({ commit, state, dispatch }) {
    const playlists = await state.s.getWholeUserPlaylists();
    dispatch("setSpotifyObjects", playlists);
    commit("setUserPlaylists", { playlists });
  }
};

export default { namespaced: true, state, mutations, getters, actions };
