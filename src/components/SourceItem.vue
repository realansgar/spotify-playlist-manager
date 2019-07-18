<template>
  <div>
    <MultiSelect
      :show-labels="false"
      :searchable="false"
      :allow-empty="false"
      placeholder=""
      v-model="selectedSource"
      :options="availableSources"
      label="label"
    />
    <div v-for="input in selectedSource.inputs" :key="input.value">
      <b-input
        v-if="input.type === 'number'"
        type="number"
        :min="input.min"
        :max="input.max"
      ></b-input>
      <MultiSelect
        :show-labels="false"
        :searchable="false"
        :
      />
    </div>
    <b-button variant="danger" :disabled="deleteDisabled">Delete</b-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MultiSelect from "vue-multiselect";

export default {
  name: "SourceItem",
  components: { MultiSelect },
  data() {
    return {
      value: null,
      selectedSource: this.availableSources[0]
    };
  },
  computed: {
    deleteDisabled() {},
    ...mapState("filters", { availableSources: "availableSources" })
  }
};
</script>

<style scoped></style>
