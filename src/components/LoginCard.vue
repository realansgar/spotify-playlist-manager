<template>
  <b-card no-body>
    <b-card-body>
      <b-card-title>
        Spotify Login
      </b-card-title>
      <b-card-text>
        Authorize Playlist Manager to use several portions of your music data.
        Your data will only be used to give you better filters.
      </b-card-text>
      <LoginPanel
        reason="accessTokenExpired"
        @update:authUrl="authUrl = $event.toString()"
      />
    </b-card-body>
    <b-card-footer>
      <span style="float: right">
        <b-button variant="primary" :href="authUrl">Login</b-button>
      </span>
    </b-card-footer>
  </b-card>
</template>

<script>
import LoginPanel from "./LoginPanel";

export default {
  name: "LoginCard",
  components: { LoginPanel },
  data() {
    return {
      authUrl: ""
    };
  }
};
</script>

<style scoped></style>
