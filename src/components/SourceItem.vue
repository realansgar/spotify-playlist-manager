<template>
  <div>
    <MultiSelect
      :show-labels="false"
      :searchable="false"
      :allow-empty="false"
      placeholder="Source Types"
      v-model="localValue.source"
      :options="availableSources"
      label="label"
    />
    <div v-for="input in (localValue.source ? localValue.source.inputs : [])" :key="input.id">
      <b-input
        v-if="input.type === 'number'"
        type="number"
        v-model="localValue[input.id]"
        :placeholder="input.label"
        :required="input.required"
        :min="input.min"
        :max="input.max"
      ></b-input>
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
      />
    </div>
    <b-button
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
