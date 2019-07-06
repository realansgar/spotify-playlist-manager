<template>
  <div v-if="option.$isLabel">
    <div class="option__desc">
      <span class="option__title">{{ option.$groupLabel }}</span>
    </div>
  </div>
  <div v-else>
    <b-img
      class="option__image"
      :src="imageSrc"
    ></b-img>
    <div class="option__desc">
      <span class="option__title">{{ option.name }}</span>
      <span class="option__small">{{ desc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpotifySearchBarOption",
  props: {
    option: Object
  },
  computed: {
    imageSrc() {
      if (this.option.type === "track") {
        return this.option.album.images[this.option.album.images.length - 1].url || "";
      } else {
        return this.option.images[this.option.images.length - 1].url || "";
      }
    },
    desc() {
      let desc = [];
      if (this.option.type === "playlist") {
        desc = [this.option.owner.display_name, this.option.tracks.total];
      } else if (this.option.type === "artist") {
        desc = [];
      } else if (this.option.type === "album") {
        desc = [...this.option.artists.map(x => x.name)];
      } else if (this.option.type === "track") {
        desc = [
          this.option.album.name,
          ...this.option.artists.map(x => x.name)
        ];
      }
      desc = desc.filter(x => x !== undefined);
      return ` •  ${desc.join(" • ")}`;
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped></style>
