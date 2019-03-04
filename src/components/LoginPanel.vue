<template>
  <b-list-group>
    <AppButtonListItem>
      Modify your public playlists
      <template v-slot:button>
        <div
          v-b-tooltip.hover
          title="The app needs this permission to save your result playlist!"
        >
          <ToggleButton class="no-margin-bottom" :value="true" disabled="true" />
        </div>
      </template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read up to 50 of your recently played songs
      <template v-slot:button>
        <ToggleButton class="no-margin-bottom"
          :value="scopes.userReadRecentlyPlayed"
          @input="scopes.userReadRecentlyPlayed = $event"
          sync
        />
      </template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read your top artists and songs
      <template v-slot:button>
        <ToggleButton class="no-margin-bottom"
          :value="scopes.userTopRead"
          @input="scopes.userTopRead = $event"
          sync
        />
      </template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read your saved songs
      <template v-slot:button>
        <ToggleButton class="no-margin-bottom"
          :value="scopes.userLibraryRead"
          @input="scopes.userLibraryRead = $event"
          sync
      /></template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read your followed artists
      <template v-slot:button
        ><ToggleButton class="no-margin-bottom"
          :value="scopes.userFollowRead"
          @input="scopes.userFollowRead = $event"
          sync
      /></template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read your private playlists
      <template v-slot:button
        ><ToggleButton class="no-margin-bottom"
          :value="scopes.playlistReadPrivate"
          @input="scopes.playlistReadPrivate = $event"
          sync
      /></template>
    </AppButtonListItem>
    <AppButtonListItem>
      Read your collaborative playlists
      <template v-slot:button>
        <ToggleButton class="no-margin-bottom"
          :value="scopes.playlistReadCollaborative"
          @input="scopes.playlistReadCollaborative = $event"
          sync
        />
      </template>
    </AppButtonListItem>
  </b-list-group>
</template>

<script>
import AppButtonListItem from "../basecomponents/AppButtonListItem";
export default {
  name: "LoginPanel",
  components: { AppButtonListItem },
  data: function() {
    return {
      clientId: "bc334213f1d743b883dabe0d47e4422e",
      baseUrl: "https://accounts.spotify.com/authorize",
      redirectUrl: "http://localhost:8080/callback.html",
      scopes: {
        userReadRecentlyPlayed: false,
        userTopRead: false,
        userLibraryRead: false,
        userFollowRead: false,
        playlistReadPrivate: false,
        playlistReadCollaborative: false,
        playlistModifyPublic: true
      }
    };
  },
  mounted() {
    if (localStorage.getItem("scopes")) {
      try {
        this.scopes = JSON.parse(localStorage.getItem("scopes"));
      } catch (e) {
        console.error(e);
      }
    }
  },
  watch: {
    scopes: {
      handler(newScopes) {
        localStorage.setItem("scopes", JSON.stringify(newScopes));
        this.$emit("update:authUrl", this.authUrl);
      },
      deep: true
    }
  },
  computed: {
    authUrl: function() {
      let scopesArr = Object.keys(this.scopes).filter(x => this.scopes[x]);
      scopesArr = scopesArr.map(x =>
        x.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      );
      let params = {
        client_id: this.clientId,
        response_type: "token",
        redirect_uri: this.redirectUrl,
        scope: scopesArr.join(" ")
      };
      let url = new URL(this.baseUrl);
      for (let [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
      }
      return url;
    }
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
