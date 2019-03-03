<template>
  <div id="app">
    <AppPage v-if="accessToken" :accessToken="accessToken" />
    <MainPage v-else />
  </div>
</template>

<script>
import MainPage from "./pages/MainPage";
import AppPage from "./pages/AppPage";

export default {
  name: "app",
  components: {
    AppPage,
    MainPage
  },
  computed: {
    accessToken: function() {
      return document.cookie.replace(
        /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
