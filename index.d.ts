export {};
import { type ShallowRef } from "vue";

declare global {
  type TemplateRef<T extends abstract new (...args: any) => any> = Readonly<
    ShallowRef<InstanceType<T> | null>
  >;
  type MaybePromise<T> = T | Promise<T>;
}

