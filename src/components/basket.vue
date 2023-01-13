<template>
  <div class="wrapper">
    <div class="main">
      <div class="main__head">
        <h1 class="main__head__header">Ваша корзина</h1>
        <div class="main__head__subheader">
          <span>{{ $t("{} товар", positions.length, "first") }}</span>
          <button
            @click="clear()"
            :disabled="empty"
            class="main__head__subheader__btn"
          >
            Очистить корзину
          </button>
        </div>
      </div>
      <div class="main__items">
        <div
          v-for="pos of positions"
          :key="pos.product.articul"
          class="main__items__item"
        >
          <div class="cross" @click="deletePos(pos)"></div>
          <div class="main__items__item__card">
            <card :product="pos.product"></card>
          </div>
          <div class="main__items__item__count">
            <counter
              @change="changeCount(pos, $event)"
              :count="pos.count"
            ></counter>
            <div class="main__items__item__count__tip" v-if="pos.count > 1">
              {{ pos.product.price }} / шт.
            </div>
          </div>
          <div class="main__items__item__sum">
            {{ (pos.count * pos.product.price).toLocaleString() }}
          </div>
        </div>
      </div>
      <div class="installation">
        <label class="installation__label">
          <input type="checkbox" v-model="needHelp" />
          <div class="installation__label__tip">
            <h3>Установка</h3>
            <p>
              Отметьте, если Вам необходима консультация профессионала по
              монтажу выбранных товаров.
            </p>
          </div>
        </label>
      </div>
    </div>
    <div class="total">
      <h2>Итого</h2>
      <div class="total__table">
        <div>
          Сумма заказа <span>{{ sum.toLocaleString() }} р</span>
        </div>
        <div>
          Количество <span>{{ pieces }} шт</span>
        </div>
        <div>
          Установка <span>{{ needHelp ? "Да" : "Нет" }}</span>
        </div>
      </div>
      <div class="total__final">
        Стоимость товаров
        <span class="total__final__sum">{{ sum.toLocaleString() }} р</span>
      </div>
      <button
        class="total__button total__button_main"
        @click="submit"
        :disabled="empty"
      >
        Оформить заказ
      </button>
      <button class="total__button" :disabled="empty">
        Купить в один клик
      </button>
    </div>
  </div>
</template>
<script lang="ts">
export {};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Card from "./product-card.vue";
import Counter from "./counter.vue";
import { product, store } from "../types";

type position = { product: product; count: number };
@Component({ components: { Card, Counter } })
export default class Basket extends Vue {
  $store!: store;
  $t!: Function;

  @Prop(Array)
  goods_!: product[];

  get goods() {
    return this.goods_ || this.$store.state.basket; //компонент можно будет использовать как с пропсами, так и с store.
  }
  positions: position[] = [];
  needHelp = false; //консультация по установке
  get sum() {
    return this.positions.reduce(
      (a, { product: { price }, count }) => a + count * price,
      0
    );
  }
  get pieces() {
    return this.positions.reduce((a, { count }) => a + count, 0);
  }
  get empty() {
    return !this.positions.length;
  }
  clear() {
    this.positions.splice(0, this.positions.length);
  }
  async submit() {
    const res: Response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        goods: this.positions.map(({ count, product }) => ({
          count,
          id: product.articul,
        })),
        installation: this.needHelp,
      }),
    });
    if (res.ok) {
      alert("Скоро вы будете перенаправлены на страницу оплаты."); //тут бы всплывающий попап прикрутить
      this.clear();
    } else {
      alert("Что-то пошло не так. Попробуйте оплатить еще раз...");
    }
  }
  deletePos(pos: position) {
    this.positions.splice(this.positions.indexOf(pos), 1);
    this.$store.commit("deleteGood", pos);
  }
  changeCount(position: position, count: number) {
    position.count = count;
  }

  @Watch("goods.length")
  update(val: number, oldval: number) {
    if (val > oldval) {
      const newItems = this.goods.filter(
        (product) => !this.positions.some((pos) => pos.product == product)
      );
      this.positions.push(
        ...newItems.map((product) => ({ product, count: 1 }))
      );
    }
  }
}
</script>
<style scoped src="../assets/css/main.css"></style>
<style scoped lang="scss">
/* for pure css
* {
  --main-border-color: silver;
  --main-color: #0069b4;
  --soft-color: #797B86;
}
*/
$main-border-color: silver;
$main-color: #0069b4;
$soft-color: #797b86;
@at-root .wrapper {
  display: grid;
  grid-template-areas: "main total";
  grid-template-columns: 70% 30%;
  @media (max-width: 768px) {
    grid-template-areas:
      "total"
      "main";
    grid-template-columns: 100%;
  }
}
.main {
  grid-area: main;
}
.main__head {
  display: flex;
  align-items: flex-end;
  margin: 0 0 4vh 0;
}
.main__head__header {
  line-height: 1em;
}
.main__head__subheader {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-grow: 1;
  margin-left: 1em;
  * {
    color: $soft-color;
  }
}
.main__head__subheader__btn {
  border: none;
  border-bottom: 0.1em solid $soft-color;
  font-size: 1.2em;
}
.main__items__item {
  display: flex;
  align-items: center;
  margin: 1em 0;
  padding: 0.5em 1em;
  position: relative;
  border-bottom: thin solid silver;
  > div {
    flex-grow: 1;
  }
}
.main__items__item__card {
  width: 50%;
}

.main__items__item__count {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main__items__item__sum {
  font-weight: bold;
  font-size: 1.4em;
}
.installation {
  margin: 6vh 0;
}
.installation__label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.installation__label__tip {
  margin-left: 2em;
  p {
    color: $soft-color;
    margin: 1em 0 0 0;
  }
}
.total {
  grid-area: total;
  margin: 0 0 0 5vw;
  @media (max-width: 768px) {
    margin: 0 0 5vh 0;
  }
}
.total__table {
  margin: 1.2em 0 0 0;
  > div {
    display: flex;
    justify-content: space-between;
    padding: 0.8em 0;
  }
}
.total__final {
  border-top: thin solid $main-border-color;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 1.2em;
  padding: 1rem 0;
}
.total__final__sum {
  font-weight: bold;
  font-size: 1.2em;
}
.total__button {
  display: block;
  width: 100%;
  color: $main-color;
  margin: 1em 0;
  border: 0.2em solid $main-color;
  border-radius: 0.4em;
  padding: 1em 0.5em;
}
.total__button:hover,
.total__button_main {
  color: white;
  background: $main-color;
}
</style>
