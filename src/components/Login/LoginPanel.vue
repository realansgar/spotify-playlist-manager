<!--suppress JSUnresolvedVariable, HtmlUnknownBooleanAttribute -->
<template>
  <b-list-group>
    <AppButtonListItem>
      Read your public data (name, profile picture, public playlists)
      <template #button>
        <div
          v-b-tooltip.hover
          title="Playlist Manager gets these permissions automatically when you login."
        >
          <ToggleButton class="no-margin-bottom" value disabled />
        </div>
      </template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read your private data (country, subscription status)
      <template #button>
        <div
          v-b-tooltip.hover
          title="Playlist Manager needs these permissions to determine your country for localised recommendations."
        >
          <ToggleButton class="no-margin-bottom" value disabled />
        </div>
      </template>
    </AppButtonListItem>
    <AppButtonListItem>
      Modify your public playlists
      <template #button>
        <div
          v-b-tooltip.hover
          title="Playlist Manager needs this permission to save your result playlist."
        >
          <ToggleButton class="no-margin-bottom" value disabled />
        </div>
      </template>
    </AppButtonListItem>
    <AppButtonListItem :danger="danger.userReadRecentlyPlayed">
      Read up to 50 of your recently played songs
      <template #button>
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
      <template #button>
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
      <template #button>
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
      <template #button
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
      <template #button
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
      <template #button>
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
import AppButtonListItem from "../../basecomponents/AppButtonListItem";
import { mapState, mapMutations } from "vuex";
export default {
  name: "LoginPanel",
  components: { AppButtonListItem },
  computed: {
    danger() {
      const obj = Object.assign({}, this.scopes);
      Object.keys(this.scopes).forEach(
        key => (obj[key] = key === this.reason && !this.scopes[key])
      );
      return obj;
    },
    ...mapState("auth", {
      scopes: "scopes",
      reason: "loginModalReason"
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
  margin-bottom: 0;
}
</style>
