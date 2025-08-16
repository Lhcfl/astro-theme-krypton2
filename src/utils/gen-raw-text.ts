import sanitize from "sanitize-html";
import he from "he";

const MathTags = [
  "maction",
  // "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mi",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mprescripts",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
];

export const genRawText = (html: string) => {
  // KaTeX renders math in a <span class="katex-html">...</span> tag twice, so we need to sanitize it properly
  const sanitezedMath = sanitize(html, {
    allowedTags: ["span", ...MathTags],
    allowedAttributes: false,
    exclusiveFilter: (frame) =>
      [frame.attribs.class === "katex-html", MathTags.includes(frame.tag)].some(
        (x) => x
      ),
  });
  return he.decode(
    sanitize(sanitezedMath, {
      allowedTags: [],
    })
  );
};
