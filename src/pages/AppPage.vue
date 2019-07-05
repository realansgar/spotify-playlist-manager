<template>
  <div>
    {{ userDisplayName }} <br />
    {{ playlist }} <br />
    <b-img :src="userImageUrl"></b-img> <br />
    <b-button @click="getMe">get Me</b-button>
    <LoginModal ref="modal" :reason="modalReason"></LoginModal>
    <b-button @click="$refs.modal.show()">Open Modal</b-button>
  </div>
</template>

<script>
import s from "../api/spotifyapiwrapper";
import LoginModal from "../components/LoginModal";

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
      user: null,
      playlist: null
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
    },
    playlistTracks() {

    }
  },
  mounted() {
    s.setAccessToken(this.accessToken);
  },
  methods: {
    async getMe() {
      const result = await s.getWholeMySavedTracks("74odZNgTsiJvVMJxwQw2GB");
      console.log(result)
    },
    errorHandling(error) {
      console.log(error);
    }
  }
};
</script>

<style scoped></style>
