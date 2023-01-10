<template>
    <div>
        <div v-for="pos of positions" :key="pos"></div>
    </div>
</template>
<script lang="ts">
export {};
const Vue = require("vue/dist/vue.js");
const { Prop, Component } = require("vue-property-decorator");
type product = {
  title: string;
  description: string;
  articul: string;
  price: number;
};
type position = { product: product; count: number };
@Component
class Basket extends Vue {
  @Prop(Array)
  goods!: product[];

  positions: position[] = [];
  get sum() {
    return this.positions.reduce(
      (a, { product: { price }, count }) => a + count * price,
      0
    );
  }
  get pieces() {
    return this.positions.reduce((a, { count }) => a + count, 0);
  }
  clear() {
    this.positions.length = 0;
  }
  submit() {}
  deletePos(pos: position){
    this.positions.splice(this.positions.indexOf(pos), 1)
  }
  changeCount(position: position, increment: 1 | -1) {
    if (position.count == 1 && increment == -1) {
      return;
    }
    position.count += increment;
  }
}
module.exports = Basket;
</script>
