<template>
  <b-modal
    ref="modal"
    @hide="handleHide"
    v-model="show"
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
import { mapState, mapGetters } from "vuex";
export default {
  name: "LoginModal",
  components: { LoginPanel },
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
    ...mapState("auth", { show: "loginModalShow", reason: "loginModalReason" }),
    ...mapGetters({ authUrl: "auth/authUrl" })
  },
  methods: {
    hide() {
      this.$store.commit("auth/updateLoginModal", { show: false });
    },
    handleHide() {
      if (this.reason === "accessTokenExpired") {
        this.$store.commit("auth/setAccessToken", { token: "" });
      }
    }
  }
};
</script>

<style scoped></style>
