<template>
  <b-modal
    ref="modal"
    @hide="handleHide"
    :show="show"
    :title="title"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
  >
    <p>{{ text }} Don't worry, your current progress will be saved.</p>
    <LoginPanel :reason="reason" />
    <template #modal-footer>
      <b-button class="float-right" variant="secondary" @click="hide()"
        >Cancel</b-button
      >
      <b-button class="float-right" variant="primary" :href="authUrl"
        >Login</b-button
      >
    </template>
  </b-modal>
</template>

<script>
import LoginPanel from "./LoginPanel";
import { mapGetters } from "vuex";
export default {
  name: "LoginModal",
  components: { LoginPanel },
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
    title() {
      switch (this.reason) {
        case "accessTokenExpired":
          return "Login expired";
        default:
          return "Authorization required";
      }
    },
    text() {
      switch (this.reason) {
        case "accessTokenExpired":
          return "Your Spotify login expired after one hour. Please login again.";
        default:
          return "Playlist Manager needs further authorization for this feature. Please login again.";
      }
    },
    ...mapGetters({ authUrl: "auth/authUrl" })
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    handleHide() {
      if (this.reason === "accessTokenExpired") {
        window.location.replace("./");
      }
    }
  }
};
</script>

<style scoped></style>
