<template>
  <MultiSelect
    class="searchbar"
    select-label=""
    deselect-label=""
    placeholder="Search Spotify!"
    :loading="loading"
    :internal-search="false"
    :close-on-select="false"
    v-model="selected"
    :options="options"
    :options-limit="20"
    group-label="type"
    group-values="items"
    @search-change="search"
  >
    <template #singleLabel="{ option }">
      <div class="option">
        <b-img class="option-image" :src="option.images[option.images.length - 1].url"></b-img>
        <span> {{ option.name }} </span>
        <span>{{ option.type }}</span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="option">
        <b-img class="option-image" :src="option.images[option.images.length - 1].url"></b-img>
        <span> {{ option.name }} </span>
        <span>{{ option.type }}</span>
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
      this.loading = true;
      if (this._lastChanged) {
        clearTimeout(this._lastChanged);
      }
      this._lastChanged = setTimeout(async () => {
        this.options = await this.s.wholeSearch(query);
        this.loading = false;
      }, 400);
    }
  },
  mounted() {
    this.options.push({
      external_urls: {
        spotify: "https://open.spotify.com/artist/08td7MxkoHQkXnWAYD8d6Q"
      },
      genres: [],
      href: "https://api.spotify.com/v1/artists/08td7MxkoHQkXnWAYD8d6Q",
      id: "08td7MxkoHQkXnWAYD8d6Q",
      images: [
        {
          height: 640,
          url:
            "https://i.scdn.co/image/f2798ddab0c7b76dc2d270b65c4f67ddef7f6718",
          width: 640
        },
        {
          height: 300,
          url:
            "https://i.scdn.co/image/b414091165ea0f4172089c2fc67bb35aa37cfc55",
          width: 300
        },
        {
          height: 64,
          url:
            "https://i.scdn.co/image/8522fc78be4bf4e83fea8e67bb742e7d3dfe21b4",
          width: 64
        }
      ],
      name: "Tania Bowra",
      popularity: 0,
      type: "artist",
      uri: "spotify:artist:08td7MxkoHQkXnWAYD8d6Q"
    });
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
