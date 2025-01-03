import { defineNuxtModule, createResolver, addComponent } from "nuxt/kit";

export interface ModuleOptions {
  // dir: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "custom-icons",
    configKey: "customIcons",
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    addComponent({
      name: "custom-icon",
      global: true,
      filePath: resolve("./runtime/components/custom-icon.vue"),
    });
  },
});
