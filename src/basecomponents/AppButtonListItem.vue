<template>
  <b-list-group-item>
    <b-container class="container">
      <b-row align-v="center" align-h="between" no-gutters>
        <b-col><slot /> </b-col>
        <b-col>
          <div class="float-right align-middle">
            <slot name="button" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-list-group-item>
</template>

<script>
export default {
  name: "AppDoubleListItem"
};
</script>

<style scoped>
.container {
  padding: 0px;
}
</style>
