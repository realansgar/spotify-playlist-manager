<template>
  <div>
    <LoginModal ref="modal" :reason="modalReason"></LoginModal>
    <b-button @click="$refs.modal.show()">Open Modal</b-button>
    <SpotifySearchBar />
  </div>
</template>

<script>
import LoginModal from "../components/LoginModal";
import SpotifySearchBar from "../components/SpotifySearchBar";

export default {
  name: "AppPage",
  components: { SpotifySearchBar, LoginModal },
  data: function() {
    return {
      user: null
    };
  },
  computed: {
    modalReason() {
      return "accessTokenExpired";
    }
  }
};
</script>

<style scoped></style>
