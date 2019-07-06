<template>
  <MultiSelect
    class="searchbar"
    select-label=""
    deselect-label=""
    placeholder="Search Spotify!"
    :loading="loading"
    :internal-search="false"
    :preserve-search="true"
    :clear-on-select="false"
    v-model="selected"
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
  </MultiSelect>
</template>

<script>
import { mapState } from "vuex";
import MultiSelect from "vue-multiselect";
import SpotifySearchBarOption from "../basecomponents/SpotifySearchBarOption";

export default {
  name: "SpotifySearchBar",
  components: { MultiSelect, SpotifySearchBarOption },
  data() {
    return {
      loading: false,
      selected: null,
      options: []
    };
  },
  computed: {
    ...mapState("songs", { s: "s" })
  },
  methods: {
    async search(query) {
      if (!query) {
        this.options = [];
        return;
      }
      this.loading = true;
      if (this._lastChanged) {
        clearTimeout(this._lastChanged);
      }
      this._lastChanged = setTimeout(async () => {
        const result = await this.s.wholeSearch(query);
        this.options = result.filter(x => x.items[0] !== undefined);
        this.loading = false;
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
