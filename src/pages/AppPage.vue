<template>
  <div>
    {{ userDisplayName }} <br />
    <b-img :src="userImageUrl"></b-img> <br />
    <b-button @click="getMe">get Me</b-button>
    <LoginModal ref="modal" :reason="modalReason"></LoginModal>
    <b-button @click="$refs.modal.show()">Open Modal</b-button>
  </div>
</template>

<script>
import SpotifyWebApi from "spotify-web-api-js";
import LoginModal from "../components/LoginModal";

let s = new SpotifyWebApi();

export default {
  name: "AppPage",
  components: { LoginModal },
  props: {
    accessToken: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      user: null
    };
  },
  computed: {
    modalReason() {
      return "accessTokenExpired";
    },
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
