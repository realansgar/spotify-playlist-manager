<template>
  <div v-if="option.$isLabel">
    <div class="option__desc">
      <span class="option__title">{{ option.$groupLabel }}</span>
    </div>
  </div>
  <div class="option" v-else>
    <b-img-lazy @click.native="$emit('image-clicked')" class="option__image" :src="imageSrc"></b-img-lazy>
    <div class="option__desc">
      <span class="option__title">{{ option.name }}</span>
      <br />
      <span class="option__small">{{ desc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpotifyObject",
  props: {
    option: Object
  },
  computed: {
    imageSrc() {
      try {
        if (this.option.type === "track") {
          return this.option.album.images[this.option.album.images.length - 1]
            .url;
        } else {
          return this.option.images[this.option.images.length - 1].url;
        }
      } catch (e) {
        return "";
      }
    },
    desc() {
      let desc = [];
      switch (this.option.type) {
        case "playlist":
          desc = [
            this.option.owner.display_name || undefined,
            `${this.option.tracks.total} tracks`
          ];
          break;
        case "artist":
          desc = [];
          break;
        case "album":
          desc = [...this.option.artists.map(x => x.name)];
          break;
        case "track":
          desc = [
            this.option.album.name,
            ...this.option.artists.map(x => x.name)
          ];
          break;
      }
      desc = desc.filter(x => x !== undefined);
      return desc.join(" • ");
    }
  }
};
</script>

<style scoped>
.option {
  display: flex;
  width: 100%;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option__desc,
.option__desc * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

.option__title {
  font-size: 15px;
}

.option__small {
  font-size: 12px;
}

.option__image {
  flex-shrink: 0;
  height: 2.5rem;
  width: 2.5rem;
  margin-right: 12px;
}
</style>
