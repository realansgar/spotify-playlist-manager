<template>
  <div>
    <MultiSelect
      class="mb-2"
      :show-labels="false"
      :searchable="false"
      :allow-empty="false"
      placeholder="Source Types"
      v-model="localValue.source"
      :options="availableSources"
      label="label"
    />
    <div
      class="mb-2"
      v-for="input in localValue.source ? localValue.source.inputs : []"
      :key="input.id"
    >
      <b-input
        v-if="input.type === 'number' || input.type === 'text'"
        :type="input.type"
        v-model="localValue[input.id]"
        :placeholder="input.label"
        :required="input.required"
        :number="input.type === 'number'"
        :min="input.min"
        :max="input.max"
      />
      <MultiSelect
        v-else-if="input.type === 'select'"
        :show-labels="false"
        :searchable="false"
        :allow-empty="!input.required"
        :placeholder="input.label"
        preselect-first
        v-model="localValue[input.id]"
        :options="input.options"
        label="label"
      />
      <SpotifySearchBar
        v-else-if="input.type === 'search'"
        v-model="localValue[input.id]"
        @artist-top="localValue"
      />
      <b-form-checkbox
        class="artist-top-toggle"
        v-if="
          input.type === 'artistTop' &&
            localValue.type &&
            localValue.type.id === 'artists'
        "
        @input="$set(localValue, 'artistTop', $event)"
        button
        button-variant="outline-primary"
      >
        {{ localValue.artistTop ? "Top Songs" : "All Songs" }}
      </b-form-checkbox>
    </div>
    <b-button
      v-if="!hideDisabled"
      variant="danger"
      :disabled="deleteDisabled"
      @click="$emit('delete', localValue)"
    >
      Delete
    </b-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MultiSelect from "vue-multiselect";
import SpotifySearchBar from "./SpotifySearchBar";

export default {
  name: "SourceItem",
  components: { MultiSelect, SpotifySearchBar },
  props: {
    value: Object,
    deleteDisabled: {
      type: Boolean,
      default: false
    },
    hideDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localValue: this.value
    };
  },
  computed: {
    ...mapState("filters", { availableSources: "availableSources" })
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        this.localValue = newValue;
      }
    },
    localValue: {
      deep: true,
      handler(newValue) {
        this.$emit("value-changed", newValue);
      }
    }
  }
};
</script>

<style scoped></style>
