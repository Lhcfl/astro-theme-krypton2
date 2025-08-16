import { getCollection } from "astro:content";

const blogs = await getCollection("blog");
const pages = await getCollection("pages");
const notes = await getCollection("notes");
const tags = new Set(
  blogs
    .map((blog) => blog.data.tags)
    .flat()
    .filter((x) => x)
);
const categories = new Set(
  blogs.map((blog) => blog.data.categories).filter((x) => x)
);

const totalWords = (collections: { body?: string }[]) =>
  collections.map((x) => x.body?.length || 0).reduce((a, b) => a + b, 0);

export const Statics = {
  blogCount: blogs.length,
  tagsCount: tags.size,
  categoriesCount: categories.size,
  pagesCount: pages.length,
  notesCount: notes.length,
  totalWords: totalWords(blogs) + totalWords(notes) + totalWords(pages),
  firstBlogDate: blogs
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
    .at(0)?.data.date,
};
