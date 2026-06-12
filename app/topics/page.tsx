import Link from 'next/link';
import { getAllKeywordTopics } from '@/lib/blogs';

export const metadata = {
  title: 'Topics | Hamzeen',
  description: 'Browse technical writing by topic across the portfolio and blog.'
};

export default async function TopicsPage() {
  const topics = await getAllKeywordTopics();

  return (
    <main className="container page-shell">
      <section className="page-hero compact-page-hero">
        <p className="eyebrow">Topics</p>
        <h1>Explore writing by topic.</h1>
        <p>
          Browse posts by architecture, frontend engineering, backend systems and delivery
          patterns.
        </p>
      </section>

      <section className="topic-grid" aria-label="All blog topics">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/topics/${topic.slug}`} className="topic-card">
            <span>{topic.name}</span>
            <small>
              {topic.count} {topic.count === 1 ? 'post' : 'posts'}
            </small>
          </Link>
        ))}
      </section>
    </main>
  );
}
