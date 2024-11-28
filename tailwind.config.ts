import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: "var(--naive-primary-color)",
        primaryActiveBg: "rgb(from var(--naive-primary-color) r g b / 0.1)",
        secondary: "var(--naive-button-color2)",
        hoverColor: "var(--naive-hover-color)",
      },
    },
  },
  plugins: [],
  content: [],
};
