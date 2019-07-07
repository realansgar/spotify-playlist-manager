<template>
  <b-card>
    <SpotifySearchBar v-for=""/>
  </b-card>
</template>

<script>
import SpotifySearchBar from "../components/SpotifySearchBar";
import {mapState} from "vuex";
export default {
  name: "PlaylistFilterPage",
  components: {SpotifySearchBar},
  computed: {
    ...mapState("filters", {  })
  }
};
</script>

<style scoped></style>
