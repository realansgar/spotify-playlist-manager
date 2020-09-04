<template>
  <b-alert :show="showing" variant="success" show>Teeest</b-alert>
</template>

<script>
export default {
  name: "NotificationToast",
  data() {
    return {
      showing: false
    };
  },
  methods: {
    show() {
      this.showing = true;
    },
    hide() {
      this.showing = false;
    }
  }
};
</script>

<style scoped></style>
