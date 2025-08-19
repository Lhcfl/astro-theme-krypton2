import { defineConfig, presetWind4, presetAttributify, presetTypography, transformerVariantGroup, presetIcons } from 'unocss'
import type { Theme } from 'unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'
import presetTheme from 'unocss-preset-theme'
import { theme } from "./themes/palettes"

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
    presetIcons(),
    presetTheme<Theme>({
      selectors: {
        ...Object.fromEntries(Object.keys(theme).map(name => [name, `[data-theme="${name}"]`])),
        light: ":root",
      },
      theme,
    })
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  rules: [
    ["content-empty", {
      content: '""',
    }],
    // text-primary+10 => color-mix(primary 90%, black 10%)
    [/^text-(.+)\+(\d+)$/, ([_, name, amount], { theme }) => {
      const color = name in (theme as Record<string, any>).colors ? `var(--colors-${name})` : name
      return {
        color: `color-mix(in srgb, ${color} ${100 - Number(amount)}%, var(--colors-content) ${amount}%)`,
      }
    }],
  ],
  shortcuts: [{
    "smooth-underline": `
        relative 
        after:(content-empty absolute left-0 bottom-0 w-full h-[0.15em] bg-primary/50 scale-0 transition-all)
        hover:after:scale-100
      `,
    "badge": "flex items-center gap-2 rounded-lg px-2 py-0.5",
  },
  [/^badge-(.*)$/, ([, c], ctx) => {
    if (["sm", "lg", "xl", "xs"].some(x => c.includes(x))) {
      return `text-${c}`
    }
    if (Object.keys((ctx.theme as Record<string, any>).colors).includes(c))
      return `bg-${c}:10 text-${c}`
  }],
  ],
  variants: [
    (matcher) => {
      if (matcher.startsWith("show-toc:")) {
        return {
          matcher: matcher.slice("show-toc:".length),
          selector: (c) => `body.show-toc ${c}, body.removing-toc ${c}`
        };
      }
      if (matcher.startsWith("has-sidebar:")) {
        return {
          matcher: matcher.slice("has-sidebar:".length),
          selector: (c) => `body.has-sidebar ${c}`
        };
      }
      return matcher;
    },
  ]
})