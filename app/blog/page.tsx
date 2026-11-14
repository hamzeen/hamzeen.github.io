import Link from "next/link";
import { getAllBlogs, getAllKeywordTopics } from "@/lib/blogs";

export const metadata = {
    title: "Blog | Hamzeen",
    description: "Technical writing on frontend architecture, backend systems and software design.",
};

export default async function BlogPage() {
    const [posts, topics] = await Promise.all([getAllBlogs(), getAllKeywordTopics()]);

    return (
        <main className="container page-shell">
            <section className="page-hero compact-page-hero">
                <p className="eyebrow">Technical writing</p>
                <h1>Blog</h1>
                <p>
                    Notes on system design, frontend architecture, backend patterns, real-time
                    systems and engineering leadership.
                </p>
            </section>

            <div className="blog-layout">
                <aside className="blog-sidebar" aria-labelledby="blog-topics-heading">
                    <h2 id="blog-topics-heading">Browse topics</h2>
                    <div className="keyword-panel blog-topic-cloud" aria-label="Blog topics">
                        {topics.map((topic) => (
                            <Link key={topic.slug} href={`/topics/${topic.slug}`}>
                                {topic.name}
                            </Link>
                        ))}
                    </div>
                </aside>

                <section className="blog-grid blog-index-grid" aria-label="Blog posts">
                    {posts.map((post, index) => (
                        <Link
                            className={`blog-card blog-index-card${index < 2 ? " blog-index-card-featured" : ""}`}
                            key={post.slug}
                            href={`/blog/${post.slug}`}>
                            <time>
                                {post.date} · {post.readingTime} min read
                            </time>
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
            </div>
        </main>
    );
}
