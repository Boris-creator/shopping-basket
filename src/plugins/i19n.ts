import { PluginObject } from "vue";
enum Declensions {
  first = "first",
}
export default class Helper implements PluginObject<any> {
  private groups = {
    first: ["ов", "", "а", "а", "а", "ов", "ов", "ов", "ов", "ов"],
  };
  install(Vue: any, options?: any) {
    const { groups } = this;
    Vue.prototype.$t = function (
      template: string,
      num: number,
      group: Declensions
    ) {
      const d = group as keyof typeof groups;
      const n = (num % 100 >=20 || num % 100 < 10) ? num % 10 : 5 //Простите за magic number :) 
      return `${template.replace(/\{\}/, num + "")}${groups[d][n]}`;
    };
  }
}
