import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllKeywordTopics, getBlogsByKeywordSlug, getKeywordTopicBySlug } from '@/lib/blogs';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const topics = await getAllKeywordTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const topic = await getKeywordTopicBySlug(slug);

  if (!topic) return {};

  return {
    title: `${topic.name} | Topics | Hamzeen`,
    description: `Technical writing about ${topic.name}.`
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const [topic, posts] = await Promise.all([
    getKeywordTopicBySlug(slug),
    getBlogsByKeywordSlug(slug)
  ]);

  if (!topic) notFound();

  return (
    <main className="container page-shell">
      <Link href="/topics" className="text-link back-link">
        ← Back to topics
      </Link>

      <section className="page-hero compact-page-hero topic-hero">
        <p className="eyebrow">Topic</p>
        <h1>{topic.name}</h1>
        <p>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} related to {topic.name}.
        </p>
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
