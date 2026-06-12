import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const blogsDir = path.join(root, 'content', 'blogs');
const publicDir = path.join(root, 'public');

type SearchItem = {
  type: 'page' | 'blog';
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

async function main() {
  await fs.mkdir(publicDir, { recursive: true });

  const files = await fs.readdir(blogsDir);
  const blogItems = await Promise.all(
    files
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(blogsDir, file), 'utf8');
        const { data, content } = matter(raw);
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

  const searchIndex = [...staticPages, ...blogItems];
  const keywords = Array.from(new Set(searchIndex.flatMap((item) => item.keywords))).sort((a, b) =>
    a.localeCompare(b)
  );

  await fs.writeFile(path.join(publicDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
  await fs.writeFile(path.join(publicDir, 'keywords.json'), JSON.stringify({ keywords }, null, 2));

  console.log(`Generated ${blogItems.length} blog entries and ${keywords.length} keywords.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
