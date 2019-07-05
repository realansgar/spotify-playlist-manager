import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import filters from "./modules/filters";
import songs from "./modules/songs";
import auth from "./modules/auth";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: "spotifyPlaylistManager",
  storage: window.localStorage,
  modules: ["filters", "auth"]
});

const store = new Vuex.Store({
  modules: {
    filters,
    auth,
    songs
  },
  plugins: [vuexLocal.plugin]
});

export default store;
