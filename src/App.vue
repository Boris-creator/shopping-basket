<template>
  <div id="app">
    <basket></basket>
  </div>
</template>

<script lang="ts">
const Basket = require("./components/basket.vue").default
export default {
  name: "App",
  components: {
    Basket,
  },
};
</script>

<style>

</style>
