import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';

const BLOGS_DIR = path.join(process.cwd(), 'content', 'blogs');

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  keywords: string[];
  readingTime?: string;
  draft?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  content: string;
  html: string;
};

async function getBlogFileNames() {
  const files = await fs.readdir(BLOGS_DIR);
  return files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
}

function normalizeFrontmatter(data: Record<string, unknown>, fallbackSlug: string): BlogFrontmatter {
  const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];

  return {
    title: String(data.title ?? fallbackSlug),
    slug: String(data.slug ?? fallbackSlug),
    date: String(data.date ?? ''),
    summary: String(data.summary ?? ''),
    keywords,
    readingTime: data.readingTime ? String(data.readingTime) : undefined,
    draft: Boolean(data.draft)
  };
}

export async function markdownToHtml(content: string) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeShiki, {
      theme: 'github-dark',
      addLanguageClass: true
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return processed.toString();
}

export async function getAllBlogs(): Promise<BlogFrontmatter[]> {
  const files = await getBlogFileNames();
  const posts = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(BLOGS_DIR, file);
      const raw = await fs.readFile(fullPath, 'utf8');
      const { data } = matter(raw);
      const fallbackSlug = file.replace(/\.mdx?$/, '');
      return normalizeFrontmatter(data, fallbackSlug);
    })
  );

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const files = await getBlogFileNames();

  for (const file of files) {
    const fullPath = path.join(BLOGS_DIR, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const fallbackSlug = file.replace(/\.mdx?$/, '');
    const frontmatter = normalizeFrontmatter(data, fallbackSlug);

    if (frontmatter.slug === slug && !frontmatter.draft) {
      const html = await markdownToHtml(content);
      return { ...frontmatter, content, html };
    }
  }

  return null;
}

export async function getAllKeywords() {
  const posts = await getAllBlogs();
  return Array.from(new Set(posts.flatMap((post) => post.keywords))).sort((a, b) =>
    a.localeCompare(b)
  );
}
