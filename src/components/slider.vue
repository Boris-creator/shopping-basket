<template>
  <div>
    <div class="page">
      <div
        class="page__btn"
        :class="{ page__btn_disabled: current == 0 }"
        @click="slideTo(current - 1)"
      >
        &#5176;
      </div>
      <div class="page__index">
        <span class="page__index__current">{{ current + 1 }}</span> /
        {{ items.length }}
      </div>
      <div
        class="page__btn"
        :class="{ page__btn_disabled: current == items.length - 1 }"
        @click="slideTo(current + 1)"
      >
        &#5171;
      </div>
    </div>
    <div class="slider" ref="slider">
      <div
        v-for="(item, i) of items"
        :key="i"
        :class="{ slider__item: true, slider__item_active: i == current }"
      >
        <slot name="item" :item="item"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { product } from "../types";
@Component
export default class Slider extends Vue {
  @Prop(Array)
  items!: product[];
  current = 0;
  private observer!: IntersectionObserver;
  slideTo(i: number) {
    this.current = Math.max(0, Math.min(this.items.length - 1, i));
  }
  async mounted() {
    const root = this.$refs.slider as HTMLElement;
    this.observer = new IntersectionObserver(
      (entries, _) => {
        const visible = new Set<number>();
        entries.forEach((e) => {
          const currentTarget = [
            ...root.querySelectorAll(".slider__item"),
          ].indexOf(e.target);
          if (e.isIntersecting) {
            visible.add(currentTarget);
          }
          if (!visible.size) {
            return;
          }
          if (visible.has(this.current)) {
            return;
          }
          this.current = Math.min(...visible);
        });
      },
      {
        threshold: 0.9,
        root,
      }
    );
    await this.$nextTick();
    root.querySelectorAll(".slider__item").forEach((t) => {
      this.observer.observe(t);
    });
  }
  beforeDestroy() {
    this.observer.disconnect();
  }
  @Watch("current")
  slide(value: number) {
    const root = this.$refs.slider as HTMLElement;
    root
      .querySelectorAll(".slider__item")
      [value].scrollIntoView({ behavior: "smooth" });
  }
}
</script>
<style lang="scss" scoped>
.slider {
  display: flex;
  width: 100%;
  overflow-x: scroll;
}
.slider__item {
  width: 45%; //их надо сделать Уже, но просто их мало, и я хотел показать, как они прокручиваются :)
  padding: 3em;
  flex-shrink: 0;
}

.slider__item_active {
  border-bottom: thin solid silver;
}

.page {
  display: flex;
  align-items: center;
  width: fit-content;
  margin-left: auto;
}
.page__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  color: white;
  background: #90a2b5;
  cursor: pointer;
  user-select: none;
}
.page__btn_disabled {
  opacity: 0.5;
}
.page__index {
  font-size: 1.2em;
  margin: 0 1rem;
}
.page__index__current {
  font-size: 1.6em;
}
</style>
