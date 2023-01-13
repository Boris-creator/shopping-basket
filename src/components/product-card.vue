<template>
  <div class="item">
    <div class="item__image">
      <img :src="product.imageSrc" class="item__image__img" />
    </div>
    <div class="item__data">
      <h4>{{ product.title }}</h4>
      <p class="item__data__descr">{{ product.description }}</p>
      <p class="item__data__art">Артикул: {{ product.articul }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { product } from "../types";

import { Component, Prop } from "vue-property-decorator";
@Component
export default class ProductCard extends Vue {
  @Prop(Object)
  product!: product;
}
</script>
<style lang="scss" scoped>
$soft-color: #797b86;

.item {
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
.item__data {
  h2,
  p {
    padding: 0.5em;
  }
}
.item__data__descr {
  line-height: 1.6em;
}
.item__image {
  width: 20%;
}
.item__image__img {
  width: 100%;
  border: thin solid grey;
}

.item__data__art {
  color: $soft-color;
}
</style>
