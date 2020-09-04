<template>
  <div>
    <div
      class="mb-2"
      style="display: flex; flex-direction: row; align-items: center;"
    >
      <b-form-checkbox
        class="mr-2"
        button
        button-variant="outline-danger"
        v-model="localValue.not"
      >
        NOT
      </b-form-checkbox>
      <MultiSelect
        :show-labels="false"
        :searchable="false"
        :allow-empty="false"
        placeholder="Filter Types"
        v-model="localValue.filterType"
        :options="availableFilters"
        label="label"
      />
    </div>
    <div
      class="mb-2"
      v-for="input in localValue.filterType ? localValue.filterType.inputs : []"
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
      <SourceItem
        v-else-if="input.type === 'source'"
        :value="localValue[input.id]"
        hide-disabled
      />
    </div>
    <b-button
      variant="danger"
      @click="$emit('delete', localValue)"
    >
      Delete
    </b-button>
  </div>
</template>

<script>
import MultiSelect from "vue-multiselect";
import { mapState } from "vuex";
import SourceItem from "./SourceItem";
export default {
  name: "FilterItem",
  components: { SourceItem, MultiSelect },
  props: {
    value: Object
  },
  data() {
    return {
      localValue: this.value
    };
  },
  computed: {
    ...mapState("filters", {
      availableFilters: "availableFilters"
    })
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
