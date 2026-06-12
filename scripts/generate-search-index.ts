import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const blogsDir = path.join(root, 'content', 'blogs');
const publicDir = path.join(root, 'public');

type SearchItem = {
  type: 'page' | 'blog' | 'topic';
  title: string;
  url: string;
  summary: string;
  keywords: string[];
  date?: string;
};

const staticPages: SearchItem[] = [
  {
    type: 'page',
    title: 'Home',
    url: '/',
    summary: 'Portfolio, architecture, engineering leadership, photography and selected work.',
    keywords: ['portfolio', 'system design', 'frontend architecture', 'micro frontends', 'devops']
  },
  {
    type: 'page',
    title: 'About',
    url: '/about',
    summary: 'Technical Lead profile, specializations, architecture principles and background.',
    keywords: ['about', 'technical lead', 'architecture', 'clean code', 'user experience']
  },
  {
    type: 'page',
    title: 'Blog',
    url: '/blog',
    summary: 'Technical writing on frontend architecture, backend systems and software design.',
    keywords: ['blog', 'technical writing', 'architecture', 'software design']
  },
  {
    type: 'page',
    title: 'Topics',
    url: '/topics',
    summary: 'Browse technical writing by topic.',
    keywords: ['topics', 'keywords', 'tags', 'blog']
  },
  {
    type: 'page',
    title: 'Contact',
    url: '/contact',
    summary: 'Contact Hamzeen for engineering, architecture and collaboration.',
    keywords: ['contact', 'collaboration', 'software engineering']
  }
];

function stripMarkdown(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>*_\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyKeyword(keyword: string) {
  return keyword
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true });

  const files = await fs.readdir(blogsDir);
  const blogItems = await Promise.all(
    files
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(blogsDir, file), 'utf8');
        const { data, content } = matter(raw);
        if (data.draft) return null;

        const slug = String(data.slug ?? file.replace(/\.mdx?$/, ''));
        const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];
        const summary = String(data.summary ?? stripMarkdown(content).slice(0, 180));

        return {
          type: 'blog' as const,
          title: String(data.title ?? slug),
          url: `/blog/${slug}`,
          summary,
          keywords,
          date: String(data.date ?? '')
        };
      })
  );

  const publishedBlogItems = blogItems.filter(
    (item): item is NonNullable<(typeof blogItems)[number]> => Boolean(item)
  );
  const keywords = Array.from(new Set(publishedBlogItems.flatMap((item) => item.keywords))).sort((a, b) =>
    a.localeCompare(b)
  );
  const topicItems: SearchItem[] = keywords.map((keyword) => ({
    type: 'topic',
    title: keyword,
    url: `/topics/${slugifyKeyword(keyword)}`,
    summary: `Browse posts about ${keyword}.`,
    keywords: [keyword, 'topic', 'blog']
  }));
  const searchIndex = [...staticPages, ...topicItems, ...publishedBlogItems];

  await fs.writeFile(path.join(publicDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
  await fs.writeFile(path.join(publicDir, 'keywords.json'), JSON.stringify({ keywords }, null, 2));

  console.log(`Generated ${publishedBlogItems.length} blog entries and ${keywords.length} keywords.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
