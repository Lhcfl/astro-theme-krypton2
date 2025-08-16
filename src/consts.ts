// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import YAML from "js-yaml";
import ConfigText from "@data/theme-config.yml?raw";
import { z } from "astro:schema";

const validator = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  nav: z.array(
    z.object({
      href: z.string(),
      icon: z.string(),
      label: z.string(),
    })
  ),
  gitalk: z
    .object({
      clientID: z.string(),
      clientSecret: z.string(),
      repo: z.string(),
      owner: z.string(),
      admin: z.array(z.string()),
    })
    .optional()
    .nullable(),
});

const ThemeConfig = (() => {
  try {
    var raw = YAML.load(ConfigText) as any;
  } catch (error) {
    console.error("Error loading theme config: ", error);
    throw new Error(
      "Failed to load theme configuration. Please check your data/theme-config.yml file."
    );
  }
  try {
    return validator.parse(raw);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = [
        `On validating theme config data/theme-config.yml:`,
        ...error.issues.map((x) => `[${x.code}] at "${x.path}": ${x.message}`),
      ].join("\n");
      throw new Error(message);
    } else {
      console.error("Unexpected error validating theme config:", error);
      throw error;
    }
  }
})();

export const SITE_TITLE = ThemeConfig.title;
export const SITE_DESCRIPTION = ThemeConfig.description;
export const SITE_AUTHOR = ThemeConfig.author;
export const SiteConfig = ThemeConfig;
export const GitalkConfig = ThemeConfig.gitalk;
