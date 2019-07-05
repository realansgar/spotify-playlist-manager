import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import filters from "./modules/filters";
import songs from "./modules/songs";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: "spotifyPlaylistManager",
  storage: window.localStorage,
  modules: ["filters"]
});

const store = new Vuex.Store({
  modules: {
    filters,
    songs
  },
  plugins: [vuexLocal.plugin]
});

export default store;
