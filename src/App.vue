<template>
  <div id="app">
    <basket></basket>
    <div class="b-slider-wrapper">
      <slider :items="recent" title="Просмотренные товары">
        <template v-slot:item="{ item }">
          <div class="slider-item">
            <img
              class="slider-item__img"
              :src="'./' + item.imageSrc"
              :alt="item.title"
            />
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <div>{{ item.price.toLocaleString() }}</div>
            <a :href="item.url" class="slider-item__a">Подробнее</a>
          </div>
        </template>
      </slider>
    </div>
  </div>
</template>

<script lang="ts">
export {};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { product, store } from "./types";
import Basket from "./components/basket.vue";
import Slider from "./components/slider.vue";
import products_list from "./examples/products.json";
import recent_list from "./examples/recent.json";

@Component({
  components: {
    Basket,
    Slider,
  },
})
export default class App extends Vue {
  $store!: store;
  recent: product[] = [];
  mounted() {
    const products: product[] = products_list;
    const recent: product[] = recent_list;
    this.$store.commit("addGoods", products); //эмулирую добавление в корзину
    recent.forEach((prod) => {
      this.$store.commit("addRecent", prod); //эмулирую добавление в просмотренные товары
    });
    this.recent.splice(0, this.recent.length, ...recent);
  }
}
</script>
<style scoped src="./assets/css/main.css"></style>
<style scoped lang="scss">
$main-color: #0069b4;

#app {
  width: 70%;
  margin: 0 auto;
}
.b-slider-wrapper {
  margin-top: 5vh;
}
.slider-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
}
.slider-item__img {
  width: 60%;
  border: thin solid;
}
.slider-item__a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 1em 0 0 0;
  padding: 1em;
  border-radius: 0.2em;
  background: $main-color;
  color: white;
}
.slider-item p,
.slider-item h2 {
  padding: 1em 0;
  margin: 1em 0;
  line-height: 1.6em;
}
</style>
