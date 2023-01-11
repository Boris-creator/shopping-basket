<template>
  <div id="app">
    <basket></basket>
    <div>
      <h2>Просмотренные товары</h2>
      <slider :items="recent">
        <template v-slot:item="{ item }">
          <div class="slider-item">
            <img
              class="slider__item__img"
              :src="'./' + item.imageSrc"
              :alt="item.title"
            />
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <div>{{ item.price.toLocaleString() }}</div>
            <a :href="item.url" class="slider__item__a">Подробнее</a>
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
import { products as list } from "./examples/products";

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
    const products: product[] = list;
    const recent = [...products]; //это другие товары конечно, просто поленился забивать новые показатели
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

.slider__item__img {
  width: 60%;
  border: thin solid;
}
.slider__item__a {
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
.slider__item p,
.slider__item h2 {
  padding: 1em 0;
  margin: 1em 0;
}
</style>
