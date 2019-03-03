<template>
  <div>
    {{ userDisplayName }} <br />
    <b-img :src="userImageUrl"></b-img> <br />
    <b-button @click="getMe">get Me</b-button>
  </div>
</template>

<script>
import SpotifyWebApi from "spotify-web-api-js";

let s = new SpotifyWebApi();

export default {
  name: "AppPage",
  data: function() {
    return {
      user: null
    };
  },
  props: {
    accessToken: {
      type: String,
      required: true
    }
  },
  computed: {
    userDisplayName() {
      return this.user ? this.user.display_name : "";
    },
    userImageUrl() {
      return this.user ? this.user.images[0].url : "";
    }
  },
  mounted() {
    s.setAccessToken(this.accessToken);
  },
  methods: {
    getMe() {
      s.getMe()
        .then(data => {
          this.user = data;
        })
        .catch(error => this.errorHandling(error));
    },
    errorHandling(error) {
      console.log(error);
    }
  }
};
</script>

<style scoped></style>
