import { render, type CollectionEntry } from "astro:content";
import { genRawText } from "./gen-raw-text";
import { experimental_AstroContainer } from "astro/container";
import { SITE_DESCRIPTION } from "@/consts";

type Blog = CollectionEntry<"blog">;

function generateDescriptionFromContent(html: string): string {
  const moreIndex = html.indexOf("<!-- more");
  const excerpt = html.slice(0, moreIndex == -1 ? undefined : moreIndex);
  return excerpt;
}

export const generateDescription = async (blog: Blog) => {
  if (blog.data.description) return blog.data.description;
  const { Content } = await render(blog); // Ensure the blog is rendered to access the body
  if (!blog.rendered) {
    console.warn(
      `Blog post ${blog.id} (${blog.filePath}) does not have rendered content. Please ensure it is properly rendered.`
    );
    return SITE_DESCRIPTION;
  }
  const { html: rendered } = blog.rendered;

  const html = blog.data.summary || generateDescriptionFromContent(rendered);

  // just remove all HTML tags
  return genRawText(html);
};
