<template>
  <b-container fluid>
    <b-card-group deck>
      <b-card
        title="1. Track sources"
        sub-title="Select track sources that should be filtered."
      >
        <SourceItem />
      </b-card>
      <b-card
        title="2. Filters"
        sub-title="Apply filters to your track collection."
      > </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import SourceItem from "../components/SourceItem";
import { mapState } from "vuex";
export default {
  name: "PlaylistFilterPage",
  components: { SourceItem},
  computed: {
    ...mapState("filters", {})
  }
};
</script>

<style scoped></style>
