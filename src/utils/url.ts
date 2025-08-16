import type { CollectionEntry } from "astro:content";

export const blogUrl = (blog: CollectionEntry<"blog">) => `/blog/${blog.id}/`;
export const pageUrl = (page: CollectionEntry<"pages">) => `/${page.id}/`;
export const tagUrl = (tag: string) => `/tags/${tag}/`;
export const categoryUrl = (category: string) => `/categories/${category}/`;
