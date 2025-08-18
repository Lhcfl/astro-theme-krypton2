type Palette = {
    primary: string,
    secondary: string,
}

const genTheme = (name: string, palette: Palette) => ({
    // 亮色主题
    [`light${name}`]: {
        colors: {
            // 背景色
            "surface": "oklch(100% 0 0)",
            "surface-100": "oklch(98% 0 0)",

            "content": "oklch(20% 0 0)",

            // 基础色
            'base-100': 'oklch(98% 0 0)',
            'base-200': 'oklch(95% 0 0)',
            'base-300': 'oklch(92% 0 0)',
            'base-content': 'oklch(20% 0 0)',

            ...palette,

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
    [`dark${name}`]: {
        colors: {
            "surface": "oklch(24% 0 0)",
            "surface-100": "oklch(28% 0 0)",

            "content": "oklch(80% 0 0)",

            // 基础色 - 暗色模式反转亮度
            'base-100': 'oklch(15% 0 0)',
            'base-200': 'oklch(20% 0 0)',
            'base-300': 'oklch(25% 0 0)',
            'base-content': 'oklch(90% 0 0)',

            ...palette,

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
});

export const theme = {
    // 蓝-绿
    ...genTheme("", {
        primary: 'oklch(55% 0.3 240)',      // 蓝
        secondary: 'oklch(65% 0.25 140)',   // 绿
    }),
    // 紫-粉
    ...genTheme("PurplePink", {
        primary: 'oklch(60% 0.25 300)',     // 紫
        secondary: 'oklch(80% 0.18 340)',   // 粉
    }),
    // 红-橙
    ...genTheme("RedOrange", {
        primary: 'oklch(65% 0.28 30)',      // 红
        secondary: 'oklch(80% 0.22 60)',    // 橙
    }),
    // 绿-蓝
    ...genTheme("GreenBlue", {
        primary: 'oklch(65% 0.25 140)',     // 绿
        secondary: 'oklch(60% 0.22 220)',   // 蓝
    }),
    // 青-黄
    ...genTheme("CyanYellow", {
        primary: 'oklch(70% 0.22 190)',     // 青
        secondary: 'oklch(80% 0.22 60)',   // 黄
    }),
    // 棕-金
    ...genTheme("BrownGold", {
        primary: 'oklch(60% 0.18 50)',      // 棕
        secondary: 'oklch(80% 0.15 85)',    // 金
    }),
}