import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { genRawText } from "@/utils/gen-raw-text";
import { blogUrl, categoryUrl, pageUrl, tagUrl } from "@/utils/url";

export const GET: APIRoute = async (context) => {
  const pages = await getCollection("pages");
  const posts = await getCollection("blog");
  const tags = [...new Set(posts.map((p) => p.data.tags ?? []).flat())];
  const categories = [
    ...new Set(posts.map((p) => p.data.categories ?? []).flat()),
  ];

  const data = [
    ...posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((p) => ({
        type: "post",
        id: p.id,
        title: p.data.title || p.data.date.toLocaleDateString(),
        url: blogUrl(p),
        content: genRawText(p.rendered?.html ?? ""),
      })),
    ...pages.map((p) => ({
      type: "page",
      id: p.id,
      title: p.data.title,
      url: pageUrl(p),
      content: genRawText(p.rendered?.html ?? ""),
    })),
    ...tags.map((tag) => ({
      type: "tag",
      title: tag,
      url: tagUrl(tag),
    })),
    ...categories.map((category) => ({
      type: "category",
      title: category,
      url: categoryUrl(category),
    })),
  ];

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
