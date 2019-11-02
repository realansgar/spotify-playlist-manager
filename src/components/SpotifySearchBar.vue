<template>
  <div class="searchbar-container">
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
      :disabled="types.length > 0"
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
      :value="value"
      @input="$emit('input', $event)"
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
  props: {
    value: {
      type: Object,
      default: null
    },
    label: {
      type: String,
      default: "Search Spotify!"
    },
    types: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.selectedTypes = JSON.parse(JSON.stringify(this.typeOptions));
  },
  data() {
    return {
      loading: false,
      selectedTypes: [],
      options: [],
      typeOptions: [
        {
          label: "My Playlists",
          value: "user_playlist"
        },
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
          label: "Songs",
          value: "track"
        }
      ],
      searchQuery: ""
    };
  },
  computed: {
    searchPlaceholder() {
      return this.searchQuery || this.label;
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
  watch: {
    value(newVal) {
      this.$emit("input", newVal);
    },
    selectedTypes() {
      this.search(this.searchQuery);
    },
    types(newVal) {
      this.selectedTypes =
        newVal.length > 0
          ? newVal
          : JSON.parse(JSON.stringify(this.typeOptions));
    }
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
  .searchbar-container {
    flex-wrap: wrap;
  }
  .type-select {
    margin-bottom: 0.5rem;
  }
}

.searchbar-container {
  display: flex;
  align-items: center;
}
</style>
