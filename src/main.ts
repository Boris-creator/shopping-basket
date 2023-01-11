export {};
import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import Helper from "./plugins/i19n";
import { product } from "./types";
Vue.config.productionTip = false;

type state = { basket: product[]; recent: product[] } & { [key: string]: any };
Vue.use(Vuex);
Vue.use(new Helper());
const store = new Vuex.Store({
  state(): state {
    return {
      basket: [],
      recent: [],
    };
  },
  mutations: {
    addGoods(state: state, item: product | product[]) {
      if (!Array.isArray(item)) {
        item = [item];
      }
      state.basket.push(...item);
    },
    deleteGood(state: state, item: product) {
      const i = state.basket.indexOf(item);
      if (!(i + 1)) {
        return;
      }
      state.basket.splice(i, 1);
    },
    addRecent(state: state, item: product) {
      state.recent.push(item);
    },
  },
});
new Vue({
  store,
  render: (h: Function) => h(App),
}).$mount("#app");
