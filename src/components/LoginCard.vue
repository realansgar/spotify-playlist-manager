<template>
  <b-card no-body>
    <b-card-body>
      <b-card-title>
        Spotify Login
      </b-card-title>
      <b-card-text>
        Authorize Playlist Manager to use several portions of your music data.
        These will enrich the filters available.
      </b-card-text>
      <LoginPanel @update:authUrl="authUrl = $event" />
    </b-card-body>
    <b-card-footer>
      <span style="float: right">
        <a :href="authUrl">
          <b-button variant="primary">Login</b-button>
        </a>
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
