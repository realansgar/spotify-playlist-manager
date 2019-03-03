<template>
  <b-list-group>
    <b-list-group-item>
      Modify your public playlists
      <span
        v-b-tooltip.hover
        title="The app needs this permission to save your result playlist!"
      >
        <ToggleButton :value="true" disabled="true" />
      </span>
    </b-list-group-item>
    <b-list-group-item>
      Read up to 50 of your recently played songs<span
        ><ToggleButton v-model="scopes.userReadRecentlyPlayed"
      /></span>
    </b-list-group-item>
    <b-list-group-item>
      Read your top artists and songs<span
        ><ToggleButton v-model="scopes.userTopRead"
      /></span>
    </b-list-group-item>
    <b-list-group-item>
      Read your saved songs
      <span><ToggleButton v-model="scopes.userLibraryRead"/></span>
    </b-list-group-item>
    <b-list-group-item>
      Read your followed artists
      <span><ToggleButton v-model="scopes.userFollowRead"/></span>
    </b-list-group-item>
    <b-list-group-item>
      Read your private playlists
      <span><ToggleButton v-model="scopes.playlistReadPrivate"/></span>
    </b-list-group-item>
    <b-list-group-item>
      Read your collaborative playlists
      <span><ToggleButton v-model="scopes.playlistReadCollaborative"/></span>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: "LoginPanel",
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
</style>
