<template>
  <b-container>
    <b-card
      class="mb-3"
      title="1. Track sources"
      sub-title="Select track sources that should be filtered."
    >
      <b-card class="mb-2 mx-0" v-for="source in sources" :key="source._id">
        <SourceItem
          :value="source"
          :delete-disabled="sources.length === 1"
          @value-changed="saveSource({ source: $event })"
          @delete="deleteSource({ source: $event })"
        />
      </b-card>
      <b-button @click="addEmptySource" variant="success">New Source</b-button>
    </b-card>
    <b-card
      class="mb-3"
      title="2. Filters"
      sub-title="Apply filters to your track collection."
    >
      <b-card class="mb-2 mx-0" v-for="filter in filters" :key="filter._id">
        <FilterItem
          :value="filter"
          :delete-disabled="filters.length === 1"
          @value-changed="saveFilter({ filter: $event })"
          @delete="deleteFilter({ filter: $event })"
        />
      </b-card>
      <b-button @click="addEmptyFilter" variant="success">New Filter</b-button>
    </b-card>
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
    ...mapMutations("filters", [
      "addEmptySource",
      "saveSource",
      "deleteSource",
      "addEmptyFilter",
      "saveFilter",
      "deleteFilter"
    ])
  }
};
</script>

<style scoped></style>
