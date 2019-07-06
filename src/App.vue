<template>
  <div id="app">
    <AppPage v-if="accessToken" />
    <MainPage v-else />
  </div>
</template>

<script>
import MainPage from "./pages/MainPage";
import AppPage from "./pages/AppPage";
import { mapState } from "vuex";

export default {
  name: "app",
  components: {
    AppPage,
    MainPage
  },
  mounted() {
    this.$store.commit("auth/setAccessToken");
  },
  computed: {
    ...mapState("auth", { accessToken: "accessToken" }),
    ...mapState("songs", {s: "s"})
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
