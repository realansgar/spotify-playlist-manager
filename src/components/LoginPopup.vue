<template>
  <b-modal @hide="handleHide" ok-disabled>
    <LoginPanel />
  </b-modal>
</template>

<script>
import LoginPanel from "./LoginPanel";

export default {
  name: "LoginPopup",
  components: { LoginPanel },
  methods: {
    handleHide(e) {
      e.preventDefault();
      window.location.replace("./");
    }
  }
};
</script>

<style scoped></style>
