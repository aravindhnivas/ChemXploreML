// .vitepress/theme/index.js
import "./custom.css";
import DefaultTheme from "vitepress/theme";
// export default DefaultTheme;

import Layout from "./Layout.vue";
import DownloadLinks from "./components/DownloadLinks.vue";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("DownloadLinks", DownloadLinks);
  },
};
