<template>
  <div id="app">
    <LoginModal />
    <PlaylistFilterPage v-if="accessToken" />
    <MainPage v-else />
    <NotificationToast ref="toast" />
    <b-button @click="$refs.toast.show()">Show</b-button>
  </div>
</template>

<script>
import PlaylistFilterPage from "./pages/PlaylistFilterPage";
import MainPage from "./pages/MainPage";
import LoginModal from "./components/Login/LoginModal";
import { mapState } from "vuex";
import s from "./api/spotifyapiwrapper";
import NotificationToast from "./components/NotificationToast";

export default {
  name: "app",
  components: {
    NotificationToast,
    LoginModal,
    MainPage,
    PlaylistFilterPage
  },
  mounted() {
    this.$store.commit("auth/setAccessToken");
  },
  computed: {
    ...mapState("auth", { accessToken: "accessToken" })
  },
  watch: {
    accessToken(newValue) {
      s.setAccessToken(newValue);
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
