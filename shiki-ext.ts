import type { LanguageRegistration } from "shiki";
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import HaskellCfg from "shiki/dist/langs/haskell.mjs";
import OCamlCfg from "shiki/dist/langs/ocaml.mjs";
import KotlinCfg from "shiki/dist/langs/kotlin.mjs";
import RustCfg from "shiki/dist/langs/rust.mjs";
import type { ShikiConfig } from "astro";

const extendShikiLanguages = (): LanguageRegistration[] => {
  return [
    {
      ...HaskellCfg[0],
      displayName: "Idris",
      name: "idris",
      aliases: ["idris2", "idr"],
      fileTypes: ["idr", "idris"],
      scopeName: "source.idris",
    },
    {
      ...OCamlCfg[0],
      displayName: "Standard ML",
      name: "standard-ml",
      aliases: ["sml", "StandardML", "SML", "ml"],
      fileTypes: ["sml"],
      scopeName: "source.sml",
    },
    {
      ...KotlinCfg[0],
      displayName: "Koka",
      name: "koka",
      aliases: [],
      fileTypes: ["koka"],
      scopeName: "source.koka",
    },
    {
      ...RustCfg[0],
      displayName: "MoonBit",
      name: "moonbit",
      aliases: ["mbt"],
      fileTypes: ["mbt"],
      scopeName: "source.moonbit",
    },
  ];
};

export const createShikiConfig = (): Partial<ShikiConfig> => ({
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  langs: extendShikiLanguages(),
  langAlias: {
    plaintext: "text",
  },
  transformers: [transformerColorizedBrackets()],
});
