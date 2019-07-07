<template>
  <div class="container">
    <MultiSelect
      class="type-select"
      :show-labels="false"
      :multiple="true"
      :searchable="false"
      :close-on-select="false"
      :allow-empty="false"
      placeholder="Result types"
      v-model="selectedTypes"
      :options="typeOptions"
      label="label"
      track-by="value"
    >
      <template #selection>
        <span>{{ selectedTypesLabel }}</span>
      </template>
    </MultiSelect>
    <MultiSelect
      class="search-select"
      :show-labels="false"
      :placeholder="searchPlaceholder"
      :loading="loading"
      :internal-search="false"
      :preserve-search="true"
      :clear-on-select="false"
      v-model="value"
      :options="options"
      :options-limit="40"
      group-label="type"
      group-values="items"
      @search-change="search"
    >
      <template #singleLabel="{ option }">
        <div class="option__desc">
          <SpotifySearchBarOption :option="option" />
        </div>
      </template>
      <template #option="{ option }">
        <div>
          <SpotifySearchBarOption :option="option" />
        </div>
      </template>
      <template #noResult>
        <span>No results</span>
      </template>
      <template #noOptions>
        <div></div>
      </template>
    </MultiSelect>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MultiSelect from "vue-multiselect";
import SpotifySearchBarOption from "../basecomponents/SpotifySearchBarOption";

export default {
  name: "SpotifySearchBar",
  components: { MultiSelect, SpotifySearchBarOption },
  mounted() {
    this.selectedTypes = JSON.parse(JSON.stringify(this.typeOptions));
  },
  data() {
    return {
      loading: false,
      value: null,
      selectedTypes: [],
      options: [],
      typeOptions: [
        {
          label: "Playlists",
          value: "playlist"
        },
        {
          label: "Artists",
          value: "artist"
        },
        {
          label: "Albums",
          value: "album"
        },
        {
          label: "Tracks",
          value: "track"
        }
      ],
      searchQuery: ""
    };
  },
  computed: {
    searchPlaceholder() {
      return this.searchQuery || "Search Spotify!";
    },
    selectedTypesLabel() {
      return this.selectedTypes.map(x => x.label).join(", ");
    },
    selectedTypesValue() {
      if (this.selectedTypes.length === 0) return undefined;
      return this.selectedTypes.map(x => x.value);
    },
    ...mapState("songs", { s: "s" })
  },
  methods: {
    async search(query) {
      this.searchQuery = query;
      if (!query) {
        this.options = [];
        return;
      }
      this.loading = true;
      if (this._lastChanged) {
        clearTimeout(this._lastChanged);
      }
      this._lastChanged = setTimeout(async () => {
        try {
          const result = await this.s.wholeSearch(
            query,
            this.selectedTypesValue
          );
          if (this.searchQuery) {
            this.options = result.filter(x => x.items[0] !== undefined);
          }
        } catch (e) {
          if (e.status === 401) {
            this.$store.commit("auth/updateLoginModal", {
              show: true,
              reason: "accessTokenExpired"
            });
          } else {
            throw e;
          }
        } finally {
          this.loading = false;
        }
      }, 400);
    }
  }
};
</script>

<!--suppress HtmlUnknownTarget -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!--suppress CssUnusedSymbol -->
<style>
.multiselect__content {
  max-width: 100%;
}
</style>

<style scoped>
.type-select {
  max-width: 16rem;
}

@media not all and (max-width: 768px) {
  .type-select {
    margin-right: 0.5rem;
  }
}

@media (max-width: 768px) {
  .container {
    flex-wrap: wrap;
  }
  .type-select {
    margin-bottom: 0.5rem;
  }
}

.container {
  display: flex;
  align-items: center;
}
</style>
