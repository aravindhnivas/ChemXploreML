import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Sidebar = {
  "/": [
    {
      text: "Introduction",
      items: [
        { text: "Getting Started", link: "/getting-started" },
        { text: "Home Interface", link: "/home/" },
      ],
    },
    {
      text: "Core Features",
      items: [
        { text: "Molecular Analysis", link: "/molecular-analysis/" },
        { text: "Load File", link: "/load-file/" },
        { text: "Vectorize Molecules", link: "/vectorize-molecules/" },
        { text: "Dimensionality Reduction", link: "/dimensionality-reduction/" },
        { text: "ML Training", link: "/ml-training/" },
      ],
    },
    {
      text: "Configuration",
      items: [{ text: "Settings", link: "/settings/" }],
    },
  ],
};
