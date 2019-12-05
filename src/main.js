import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
import "vue-multiselect/dist/vue-multiselect.min.css";
import "./styles/global-styles.scss";
import ToggleButton from "vue-js-toggle-button";

Vue.use(BootstrapVue);
Vue.use(ToggleButton);

Vue.config.devtools = true;
Vue.config.productionTip = false;

// noinspection JSUnusedGlobalSymbols
new Vue({
  render: h => h(App),
  store
}).$mount("#app");
