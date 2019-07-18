<template>
  <b-container fluid>
    <b-card-group deck>
      <b-card
        title="1. Track sources"
        sub-title="Select track sources that should be filtered."
      >
        <SpotifySearchBar v-for=""/>
      </b-card>
      <b-card
        title="2. Filters"
        sub-title="Apply filters to your track collection."
      > </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import SpotifySearchBar from "../components/SpotifySearchBar";
import { mapState } from "vuex";
export default {
  name: "PlaylistFilterPage",
  components: { SpotifySearchBar },
  computed: {
    ...mapState("filters", {})
  }
};
</script>

<style scoped></style>
