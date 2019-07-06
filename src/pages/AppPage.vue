<template>
  <div>
    <LoginModal ref="modal" :reason="modalReason"></LoginModal>
    <b-button @click="$refs.modal.show()">Open Modal</b-button>
    <b-container><SpotifySearchBar /></b-container>
  </div>
</template>

<script>
import LoginModal from "../components/LoginModal";
import SpotifySearchBar from "../components/SpotifySearchBar";

export default {
  name: "AppPage",
  components: { SpotifySearchBar, LoginModal },
  computed: {
    modalReason() {
      return "accessTokenExpired";
    }
  }
};
</script>

<style scoped></style>
