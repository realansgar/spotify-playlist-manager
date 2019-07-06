import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import filters from "./modules/filters";
import songs from "./modules/songs";
import auth from "./modules/auth";

Vue.use(Vuex);

const vuexLocalFilters = new VuexPersistence({
  key: "spotifyPlaylistManagerFilters",
  storage: window.localStorage,
  modules: ["filters"]
});

const vuexLocalScopes = new VuexPersistence({
  key: "spotifyPlaylistManagerScopes",
  storage: window.localStorage,
  reducer: state => ({ scopes: state.auth.scopes })
});

const store = new Vuex.Store({
  modules: {
    filters,
    auth,
    songs
  },
  plugins: [vuexLocalFilters.plugin, vuexLocalScopes.plugin]
});

export default store;
