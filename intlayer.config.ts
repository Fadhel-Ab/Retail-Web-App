import { Locales, type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.ARABIC], // your locales
    defaultLocale: Locales.ENGLISH,
  },
  routing: {
    mode: "prefix-all",
  },
};

export default config;