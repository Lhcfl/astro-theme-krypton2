import { render, type CollectionEntry } from "astro:content";
import { genRawText } from "./gen-raw-text";
import { experimental_AstroContainer } from "astro/container";
import { SITE_DESCRIPTION } from "@/consts";

type Blog = CollectionEntry<"blog">;

let container: any = null;
async function getContainer(): ReturnType<typeof experimental_AstroContainer.create> {
  return container ||= await experimental_AstroContainer.create();
}

function generateDescriptionFromContent(html: string): string {
  const moreIndex = html.indexOf("<!-- more");
  const excerpt = html.slice(0, moreIndex == -1 ? undefined : moreIndex);
  return excerpt;
}

async function getRenderedContent(blog: Blog) {
  const container = await getContainer();
  const { Content } = await render(blog); // Ensure the blog is rendered to access the body
  return await container.renderToString(Content);
}

export const generateDescription = async (blog: Blog) => {
  if (blog.data.description) return blog.data.description;

  const rendered = await getRenderedContent(blog).catch(err => {
    console.error(err);
    return SITE_DESCRIPTION;
  });

  // if (!blog.rendered) {
  //   console.warn(
  //     `Blog post ${blog.id} (${blog.filePath}) does not have rendered content. Please ensure it is properly rendered.`
  //   );
  //   return SITE_DESCRIPTION;
  // }
  // const { html: rendered } = blog.rendered;

  const html = blog.data.summary || generateDescriptionFromContent(rendered);

  // just remove all HTML tags
  return genRawText(html);
};
