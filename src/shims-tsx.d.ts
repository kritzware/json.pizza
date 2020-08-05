import Vue, { VNode } from "vue";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    // @ts-ignore Vue type error
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      // @ts-ignore Vue type error
      [elem: string]: any;
    }
  }
}
