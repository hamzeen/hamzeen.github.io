import Link from 'next/link';
import { getAllBlogs, getAllKeywords } from '@/lib/blogs';

export const metadata = {
  title: 'Blog | Hamzeen',
  description: 'Technical writing on frontend architecture, backend systems and software design.'
};

export default async function BlogPage() {
  const [posts, keywords] = await Promise.all([getAllBlogs(), getAllKeywords()]);

  return (
    <main className="container page-shell">
      <section className="page-hero compact-page-hero">
        <p className="eyebrow">Technical writing</p>
        <h1>Blog</h1>
        <p>
          Notes on system design, frontend architecture, backend patterns, real-time systems and
          engineering leadership.
        </p>
      </section>

      <section className="keyword-panel" aria-label="Blog keywords">
        {keywords.map((keyword) => (
          <Link key={keyword} href={`/search?q=${encodeURIComponent(keyword)}`}>
            {keyword}
          </Link>
        ))}
      </section>

      <section className="blog-grid">
        {posts.map((post) => (
          <Link className="blog-card" key={post.slug} href={`/blog/${post.slug}`}>
            <time>{post.date}</time>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <div className="tag-row">
              {post.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
