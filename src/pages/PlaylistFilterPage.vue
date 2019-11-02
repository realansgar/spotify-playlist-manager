<template>
  <b-container fluid>
    <b-card-group deck>
      <b-card
        title="1. Track sources"
        sub-title="Select track sources that should be filtered."
      >
        <SourceItem v-for="source in sources" :key="source._id" :value="source" @value-changed="saveSource({ source: $event })" @delete="deleteSource({ source: $event })"/>
        <b-button @click="addEmptySource">New Source</b-button>
      </b-card>
      <b-card
        title="2. Filters"
        sub-title="Apply filters to your track collection."
      >
        <FilterItem v-for="filter in filters" :key="filter._id" :value="filter" @value-changed="saveFilter({ filter: $event })" @delete="deleteFilter({ filter: $event })"/>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import SourceItem from "../components/SourceItem";
import FilterItem from "../components/FilterItem";
import { mapState, mapMutations } from "vuex";
export default {
  name: "PlaylistFilterPage",
  components: { FilterItem, SourceItem },
  computed: {
    ...mapState("filters", { sources: "sources", filters: "filters" })
  },
  methods: {
    ...mapMutations("filters", ["addEmptySource", "saveSource", "deleteSource"])
  }
};
</script>

<style scoped></style>
