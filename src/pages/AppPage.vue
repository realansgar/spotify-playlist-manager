<template>
  <div>
    <LoginModal ref="modal"></LoginModal>
    <b-container><SpotifySearchBar /></b-container>
  </div>
</template>

<script>
import LoginModal from "../components/Login/LoginModal";
import SpotifySearchBar from "../components/SpotifySearchBar";

export default {
  name: "AppPage",
  components: { SpotifySearchBar, LoginModal }
};
</script>

<style scoped></style>
