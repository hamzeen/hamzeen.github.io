import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogs, getAuthorImagePath, getBlogBySlug, slugifyKeyword } from '@/lib/blogs';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) return {};

  return {
    title: `${post.title} | Hamzeen`,
    description: post.summary,
    keywords: post.keywords
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) notFound();

  return (
    <main className="container article-shell">
      <Link href="/blog" className="text-link back-link">← Back to blog</Link>
      <article>
        <header className="article-header">
          <h1>{post.title}</h1>
          <div className="author-meta">
            <Image
              src={getAuthorImagePath(post.author)}
              alt={post.author}
              width={44}
              height={44}
              className="author-avatar"
            />
            <p className="author-meta-text">
              <span className="author-name">{post.author}</span>
              <span aria-hidden="true"> · </span>
              <span>{post.readingTime} min read</span>
              <span aria-hidden="true"> · </span>
              <span>{post.date}</span>
            </p>
          </div>
          <p>{post.summary}</p>
          <div className="tag-row">
            {post.keywords.map((keyword) => (
              <Link key={keyword} href={`/topics/${slugifyKeyword(keyword)}`}>
                {keyword}
              </Link>
            ))}
          </div>
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
