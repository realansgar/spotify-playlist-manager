<template>
  <div id="app">
    <LoginModal />
    <PlaylistFilterPage v-if="accessToken" />
    <MainPage v-else />
  </div>
</template>

<script>
import PlaylistFilterPage from "./pages/PlaylistFilterPage";
import MainPage from "./pages/MainPage";
import LoginModal from "./components/Login/LoginModal";
import { mapState } from "vuex";

export default {
  name: "app",
  components: {
    LoginModal,
    MainPage,
    PlaylistFilterPage
  },
  mounted() {
    this.$store.commit("auth/setAccessToken");
  },
  computed: {
    ...mapState("auth", { accessToken: "accessToken" }),
    ...mapState("songs", { s: "s" })
  },
  watch: {
    accessToken(newValue) {
      this.s.setAccessToken(newValue);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}
</style>
