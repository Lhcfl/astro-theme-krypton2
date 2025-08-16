import { defineConfig, presetWind4, presetAttributify, presetTypography, transformerVariantGroup, presetIcons } from 'unocss'
import type { Theme } from 'unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'
import presetTheme from 'unocss-preset-theme'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
    presetIcons(),
    presetTheme<Theme>({
      selectors: {
        light: ":root",
        dark: "[data-theme='dark']"
      },
      theme: {
        // 亮色主题
        light: {
          colors: {
            // 背景色
            "surface": "oklch(100% 0 0)",
            "surface-100": "oklch(98% 0 0)",

            "content": "oklch(20% 0 0)",

            // 基础色
            'base-100': 'oklch(98% 0.02 240)',
            'base-200': 'oklch(95% 0.03 240)',
            'base-300': 'oklch(92% 0.04 240)',
            'base-content': 'oklch(20% 0.05 240)',

            // 主色
            'primary': 'oklch(55% 0.3 240)',
            'primary-content': 'oklch(98% 0.01 240)',

            // 次要色
            'secondary': 'oklch(70% 0.25 200)',
            'secondary-content': 'oklch(98% 0.01 200)',

            // 强调色
            'accent': 'oklch(65% 0.25 160)',
            'accent-content': 'oklch(98% 0.01 160)',

            // 中性色
            'neutral': 'oklch(50% 0.05 240)',
            'neutral-content': 'oklch(98% 0.01 240)',

            // 语义色彩
            'info': 'oklch(70% 0.2 220)',
            'info-content': 'oklch(98% 0.01 220)',

            'success': 'oklch(65% 0.25 140)',
            'success-content': 'oklch(98% 0.01 140)',

            'warning': 'oklch(80% 0.25 80)',
            'warning-content': 'oklch(20% 0.05 80)',

            'error': 'oklch(65% 0.3 30)',
            'error-content': 'oklch(98% 0.01 30)',
          }
        },

        // 暗色主题
        dark: {
          colors: {
            "surface": "oklch(24% 0 0)",
            "surface-100": "oklch(28% 0 0)",

            "content": "oklch(80% 0 0)",

            // 基础色 - 暗色模式反转亮度
            'base-100': 'oklch(15% 0.02 240)',
            'base-200': 'oklch(20% 0.03 240)',
            'base-300': 'oklch(25% 0.04 240)',
            'base-content': 'oklch(90% 0.05 240)',

            // 主色 - 稍微提高亮度
            'primary': 'oklch(65% 0.3 240)',
            'primary-content': 'oklch(15% 0.01 240)',

            // 次要色
            'secondary': 'oklch(60% 0.25 200)',
            'secondary-content': 'oklch(15% 0.01 200)',

            // 强调色
            'accent': 'oklch(70% 0.25 160)',
            'accent-content': 'oklch(15% 0.01 160)',

            // 中性色
            'neutral': 'oklch(40% 0.05 240)',
            'neutral-content': 'oklch(85% 0.01 240)',

            // 语义色彩 - 调整适合暗色背景
            'info': 'oklch(75% 0.2 220)',
            'info-content': 'oklch(15% 0.01 220)',

            'success': 'oklch(70% 0.25 140)',
            'success-content': 'oklch(15% 0.01 140)',

            'warning': 'oklch(85% 0.25 80)',
            'warning-content': 'oklch(15% 0.05 80)',

            'error': 'oklch(70% 0.3 30)',
            'error-content': 'oklch(15% 0.01 30)',
          }
        }
      },
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
          selector: (c) => `body.show-toc ${c}`
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