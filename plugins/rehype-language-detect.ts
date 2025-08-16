import { franc } from "franc";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { iso6393To1 } from "iso-639-3";

export function rehypeLanguageDetect() {
  return (tree: any) => {
    visit(tree, "element", (node) => {
      if (["p", "ul", "ol"].includes(node.tagName)) {
        const textContent = toString(node);
        const lang = franc(textContent, { minLength: 10 });
        if (lang === "und") {
          return; // Skip if language cannot be detected
        }
        const toLang: Record<string, string> = {
          ...iso6393To1,
          cmn: "zh",
        };
        node.properties.lang = toLang[lang];
      }
    });
  };
}
