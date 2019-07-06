import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import ToggleButton from "vue-js-toggle-button";

Vue.use(BootstrapVue);
Vue.use(ToggleButton);

Vue.config.devtools = true;
Vue.config.productionTip = false;
Vue.config.ignoredElements = ["vaadin-combo-box"];

new Vue({
  render: h => h(App),
  store
}).$mount("#app");
