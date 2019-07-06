<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <b-list-group>
    <AppButtonListItem>
      Read your public data (name, profile picture, public playlists)
      <template v-slot:button>
        <div
          v-b-tooltip.hover
          title="Playlist Manager gets these permissions automatically when you login."
        >
          <ToggleButton class="no-margin-bottom" :value="true" disabled />
        </div>
      </template>
    </AppButtonListItem>
    <AppButtonListItem>
      Modify your public playlists
      <template v-slot:button>
        <div
          v-b-tooltip.hover
          title="Playlist Manager needs this permission to save your result playlist."
        >
          <ToggleButton class="no-margin-bottom" :value="true" disabled />
        </div>
      </template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.userReadRecentlyPlayed">
      Read up to 50 of your recently played songs
      <template v-slot:button>
        <ToggleButton
          class="no-margin-bottom"
          :value="scopes.userReadRecentlyPlayed"
          @input="
            updateScopes({
              key: 'userReadRecentlyPlayed',
              value: $event
            })
          "
          sync
        />
      </template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.userTopRead">
      Read your top artists and songs
      <template v-slot:button>
        <ToggleButton
          class="no-margin-bottom"
          :value="scopes.userTopRead"
          @input="
            updateScopes({
              key: 'userTopRead',
              value: $event
            })
          "
          sync
        />
      </template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.userLibraryRead">
      Read your saved songs
      <template v-slot:button>
        <ToggleButton
          class="no-margin-bottom"
          :value="scopes.userLibraryRead"
          @input="
            updateScopes({
              key: 'userLibraryRead',
              value: $event
            })
          "
          sync
        />
      </template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.userFollowRead">
      Read your followed artists
      <template v-slot:button
        ><ToggleButton
          class="no-margin-bottom"
          :value="scopes.userFollowRead"
          @input="
            updateScopes({
              key: 'userFollowRead',
              value: $event
            })
          "
          sync
      /></template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.playlistReadPrivate">
      Read your private playlists
      <template v-slot:button
        ><ToggleButton
          class="no-margin-bottom"
          :value="scopes.playlistReadPrivate"
          @input="
            updateScopes({
              key: 'playlistReadPrivate',
              value: $event
            })
          "
          sync
      /></template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.playlistReadCollaborative">
      Read your collaborative playlists
      <template v-slot:button>
        <ToggleButton
          class="no-margin-bottom"
          :value="scopes.playlistReadCollaborative"
          @input="
            updateScopes({
              key: 'playlistReadCollaborative',
              value: $event
            })
          "
          sync
        />
      </template>
    </AppButtonListItem>
  </b-list-group>
</template>

<script>
import AppButtonListItem from "../basecomponents/AppButtonListItem";
import { mapState, mapMutations } from "vuex";
export default {
  name: "LoginPanel",
  components: { AppButtonListItem },
  props: {
    reason: {
      type: String,
      validator: val =>
        [
          "accessTokenExpired",
          "userReadRecentlyPlayed",
          "userTopRead",
          "userLibraryRead",
          "userFollowRead",
          "playlistReadPrivate",
          "playlistReadCollaborative"
        ].includes(val)
    }
  },
  computed: {
    danger() {
      const obj = Object.assign({}, this.$store.state.auth.scopes);
      Object.keys(this.$store.state.auth.scopes).forEach(
        key =>
          (obj[key] =
            key === this.reason && !this.$store.state.auth.scopes[key])
      );
      return obj;
    },
    ...mapState("auth", {
      scopes: "scopes"
    })
  },
  methods: {
    ...mapMutations({ updateScopes: "auth/updateScopes" })
  }
};
</script>

<style scoped>
span {
  float: right;
}

.no-margin-bottom {
  margin-bottom: 0px;
}
</style>
