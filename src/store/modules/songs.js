import s from "../../api/spotifyapiwrapper";

const state = {
  s,
  userPlaylists: []
};

const mutations = {
  setUserPlaylists(state, { playlists }) {
    state.userPlaylists = playlists;
  }
};

const getters = {
  searchUserPlaylists: state => query =>
    state.userPlaylists.findAll(playlist =>
      playlist.name.toLowerCase().includes(query.toLowerCase())
    )
};

const actions = {
  async getUserPlaylists({ commit, state }) {
    const playlists = await state.s.getWholeUserPlaylists();
    commit("setUserPlaylists", { playlists });
  }
};

export default { namespaced: true, state, mutations, getters, actions };
