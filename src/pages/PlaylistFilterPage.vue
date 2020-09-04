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
          @value-changed="saveSource({ source: $event })"
          @delete="deleteSource({ source: $event })"
        />
      </b-card>
      <b-button @click="addEmptySource" variant="success">New Source</b-button>
    </b-card>
    <b-card
      class="mb-3"
      title="2. Filters"
      sub-title="Apply filters to your tracks."
    >
      <b-card class="mb-2 mx-0" v-for="filter in filters" :key="filter._id">
        <FilterItem
          :value="filter"
          @value-changed="saveFilter({ filter: $event })"
          @delete="deleteFilter({ filter: $event })"
        />
      </b-card>
      <b-button @click="addEmptyFilter" variant="success">New Filter</b-button>
    </b-card>
    <b-card title="3. Results">
      <div class="flex-row">
        <b-button class="mb-3 mr-3" @click="calculate" variant="success"
          >Calculate</b-button
        >
        <b-spinner class="mt-1" v-if="loading" variant="primary" />
      </div>
      <div v-if="!loading && resultTracks.length > 0">
        <div class="flex-row mb-3">
          <b-form-input
            :value="playlistName"
            @input="setPlaylistName({ name: $event })"
            placeholder="Playlist Name"
          />
          <b-button class="ml-3" @click="save" variant="success">Save</b-button>
        </div>
        <b-list-group>
          <b-list-group-item ref="tracklist" v-for="(track, i) in resultTracks" :key="track.id">
            <audio :src="track.preview_url" />
            <SpotifyObject :option="track" @image-clicked="togglePlayback(i)" />
          </b-list-group-item>
        </b-list-group>
        <div class="flex-row mt-3">
          <b-form-input
            :value="playlistName"
            @input="setPlaylistName({ name: $event })"
            placeholder="Playlist Name"
          />
          <b-button class="ml-3" @click="save" variant="success">Save</b-button>
        </div>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import SourceItem from "../components/SourceItem";
import FilterItem from "../components/FilterItem";
import { filterTracks, savePlaylist } from "../api/filtering";
import { mapState, mapMutations } from "vuex";
import SpotifyObject from "../basecomponents/SpotifyObject";
export default {
  name: "PlaylistFilterPage",
  components: { SpotifyObject, FilterItem, SourceItem },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState("filters", { sources: "sources", filters: "filters" }),
    ...mapState("tracks", {
      resultTracks: "resultTracks",
      playlistName: "playlistName"
    })
  },
  methods: {
    ...mapMutations("filters", [
      "addEmptySource",
      "saveSource",
      "deleteSource",
      "addEmptyFilter",
      "saveFilter",
      "deleteFilter"
    ]),
    ...mapMutations("tracks", ["setResultTracks", "setPlaylistName"]),
    async calculate() {
      try {
        this.loading = true;
        const tracks = await filterTracks(this.sources, this.filters);
        this.setResultTracks({ tracks });
        this.loading = false;
      } catch (e) {
        if (e.status === 401) {
          this.$store.commit("auth/updateLoginModal", {
            show: true,
            reason: "accessTokenExpired"
          });
        } else if (e.status === 403) {
          this.$store.commit("auth/updateLoginModal", {
            show: true,
            reason: e.reason
          });
        }
        throw e;
      }
    },
    async save() {
      try {
        await savePlaylist(this.playlistName, this.resultTracks);
      } catch (e) {
        if (e.status === 401) {
          this.$store.commit("auth/updateLoginModal", {
            show: true,
            reason: "accessTokenExpired"
          });
        } else {
          throw e;
        }
      }
    },
    async togglePlayback(i) {
      const audio = this.$refs.tracklist[i].firstChild;
      if (audio.paused) {
        this.$refs.tracklist.forEach(x => x.firstChild.pause());
        await audio.play();
      } else {
        audio.pause();
      }
    }
  }
};
</script>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;

}
</style>
