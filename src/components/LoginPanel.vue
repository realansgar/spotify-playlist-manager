<template>
  <a :href="authUrl"><b-button>Login</b-button></a>
</template>

<script>
import $ from "jquery";

export default {
  name: "LoginPanel",
  data: function() {
    return {
      clientId: "bc334213f1d743b883dabe0d47e4422e",
      baseUrl: "https://accounts.spotify.com/authorize",
      redirectUrl: "http://localhost:8080/callback.html",
      scopes: ["user-read-private"]
    };
  },
  computed: {
    authUrl: function() {
      let params = {
        client_id: this.clientId,
        response_type: "token",
        redirect_uri: this.redirectUrl,
        scope: this.scopes.join(" ")
      };
      return `${this.baseUrl}?${$.param(params)}`;
    }
  }
};
</script>

<style scoped></style>
