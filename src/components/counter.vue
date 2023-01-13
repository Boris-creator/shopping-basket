<template>
  <div class="count" tabindex="0" @keydown="keyHelper">
    <button class="count__button" @click="change(-1)" :disabled="count_ == 1">
      &minus;
    </button>
    <span>{{ count }}</span>
    <button class="count__button" @click="change(1)">&plus;</button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
@Component
export default class Counter extends Vue {
  @Prop(Number)
  count!: number;
  @Prop({
    type: Number,
    default: 1,
  })
  min!: number;

  count_!: number;

  @Emit("change")
  output() {
    return this.count_;
  }

  change(increment: 1 | -1) {
    if (this.count_ == this.min && increment == -1) {
      return;
    }
    this.count_ += increment;
    this.output();
  }
  keyHelper(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key == "ArrowUp") {
      this.change(1);
    }
    if (e.key == "ArrowDown") {
      this.change(-1);
    }
  }
  created() {
    this.count_ = this.count;
  }
}
</script>
<style scoped src="../assets/css/main.css"></style>
<style lang="scss" scoped>
.count {
  outline: none;
  font-size: 1.6em;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    font-size: 2.2em;
  }
}
.count__button {
  border: none;
  outline: none;
  margin: 0 1em;
  font-size: inherit;
}
</style>
