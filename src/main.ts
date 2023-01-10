const Vue = require("vue/dist/vue.js");
const App = require("./App.vue").default

Vue.config.productionTip = false;

new Vue({
  render: (h: Function) => h(App),
}).$mount("#app");
