<template>
  <MultiSelect
    class="searchbar"
    select-label=""
    deselect-label=""
    placeholder="Search Spotify!"
    :loading="loading"
    :internal-search="false"
    :close-on-select="false"
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
      <div class="option">
        <!--<b-img class="option-image" :src="option.images[option.images.length - 1].url"></b-img>
        <span> {{ option.name }} </span>
        <span>{{ option.type }}</span>-->
      </div>
    </template>
    <template #option="{ option }">
      <div class="option">
        {{option.type}}
        <!--<b-img class="option-image" :src="option.images[option.images.length - 1].url"></b-img>
        <span> {{ option.name }} </span>
        <span>{{ option.type }}</span>-->
      </div>
    </template>
  </MultiSelect>
</template>

<script>
import { mapState } from "vuex";
import MultiSelect from "vue-multiselect";
export default {
  name: "SpotifySearchBar",
  components: { MultiSelect },
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
      if (!query) return;
      this.loading = true;
      if (this._lastChanged) {
        clearTimeout(this._lastChanged);
      }
      this._lastChanged = setTimeout(async () => {
        const result = await this.s.wholeSearch(query);
        console.log(result);
        this.options = result;
        this.loading = false;
      }, 400);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.option-image {
  max-height: 2.5em;
}

.searchbar {

}
</style>
