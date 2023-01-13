<template>
  <div tabindex="0" @keydown="keyHelper" class="wrapper">
    <div class="head">
      <h2>{{ title }}</h2>
      <div class="page">
        <div
          class="page__btn page__btn_left"
          :class="{ page__btn_disabled: current == 0 }"
          @click="slideTo(current - 1)"
        ></div>
        <div class="page__index">
          <span class="page__index__current">{{ current + 1 }}</span> /
          {{ items.length }}
        </div>
        <div
          class="page__btn page__btn_right"
          :class="{ page__btn_disabled: current == items.length - 1 }"
          @click="slideTo(current + 1)"
        ></div>
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
  @Prop(String)
  title!: string;

  current = 0;
  private observer!: IntersectionObserver;
  private visibleSlides: Set<number> = new Set();
  private visibleAmount = -1;
  slideTo(i: number) {
    this.current = Math.max(0, Math.min(this.items.length - 1, i));
  }
  keyHelper(e: KeyboardEvent) {
    if (e.key == "ArrowRight") {
      this.slideTo(this.current + 1);
    }
    if (e.key == "ArrowLeft") {
      this.slideTo(this.current - 1);
    }
  }
  async mounted() {
    const root = this.$refs.slider as HTMLElement;
    const visible = this.visibleSlides;
    this.observer = new IntersectionObserver(
      (entries, _) => {
        entries.forEach((e) => {
          const currentTarget = [
            ...root.querySelectorAll(".slider__item"),
          ].indexOf(e.target);
          if (e.isIntersecting) {
            visible.add(currentTarget);
          } else {
            visible.delete(currentTarget);
          }
        });
        if (this.visibleAmount == -1 && visible.size) {
          this.visibleAmount = visible.size;
        }
        if (visible.size != this.visibleAmount) {
          return;
        }
        if (visible.has(this.current)) {
          return;
        }
        this.current = Math.min(...visible);
      },
      {
        threshold: 0.7,
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
    const root = this.$refs.slider as HTMLElement,
      slide = root.querySelectorAll(".slider__item")[value];
    root.scroll({
      left:
        slide.getBoundingClientRect().left +
        root.scrollLeft -
        root.getBoundingClientRect().left,
      behavior: "smooth",
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  outline: none;
}
.slider {
  display: flex;
  align-items: stretch;
  width: 100%;
  overflow-x: scroll;
}
.slider__item {
  width: 30%;
  padding: 3em;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 40%;
  }
}

.slider__item_active {
  border-bottom: thin solid silver;
}
.head {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
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
  &:after {
    content: "";
    display: block;
    width: 1em;
    height: 1em;
    border-bottom: 0.2em solid white;
    border-right: 0.2em solid white;
  }
}
.page__btn_left:after {
  rotate: 135deg;
  translate: 0.2em 0;
}
.page__btn_right:after {
  rotate: -45deg;
  translate: -0.2em 0;
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
