import { Store } from "vuex";
export type product = {
  title: string;
  description: string;
  articul: string;
  price: number;
  imageSrc?: string;
  url?: string
};
export type store = Store<any>;
