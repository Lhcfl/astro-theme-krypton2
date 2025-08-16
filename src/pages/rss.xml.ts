import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_AUTHOR } from "../consts";
import type { APIRoute } from "astro";
import { generateDescription } from "@/utils/gen-description";
import { blogUrl } from "@/utils/url";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: await Promise.all(
      posts
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
        .map(async (post) => ({
          title: post.data.title,
          link: blogUrl(post),
          description: await generateDescription(post),
          pubDate: post.data.date,
          categories: [
            ...(post.data.tags ?? []),
            ...(post.data.categories ? [post.data.categories] : []),
          ],
          author: SITE_AUTHOR,
          content: post.rendered?.html,
          source: {
            title: SITE_TITLE,
            url: new URL("/rss.xml", context.site!).href,
          },
        }))
    ),
  });
};
