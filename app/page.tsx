import Link from "next/link";
import { getAllBlogs } from "@/lib/blogs";

const skills = [
    "Solution Architecture",
    "Event-Driven  Architecture",
    "Micro-Frontends",
    "Reactive Programming",
];
const values = [
    { title: "System Design", text: "lays the foundation" },
    { title: "Process", text: "agile execution" },
    { title: "User-Centric Design", text: "exceptional UX" },
];

export default async function HomePage() {
    const blogs = await getAllBlogs();

    return (
        <main>
            <section className="container intro-grid section-space">
                <img src="images/hamzeen-2025.jpg" />

                <div className="copy-block">
                    <p>Hi There!</p>
                    <p>
                        My name is Hamzeen, and I'm a full stack engineer with a passion for
                        building scalable web applications with clean code and thoughtful user
                        experience.
                    </p>
                    <p>
                        I have worked on the design and implementation of frontend architectures,
                        backend systems, and event-driven applications — turning complex product
                        needs into reliable, maintainable software.
                    </p>
                    <p>
                        Outside of work, I enjoy traveling, reading, listening to music, playing
                        table tennis, and skiing.
                    </p>
                    {/*<p>
                        Some of his <span className="pill">specializations</span>
                    </p>*/}
                </div>
            </section>
            <section className="container section-space">
                <div className="section-heading split-heading">
                    <div>
                        <p className="eyebrow">Writing</p>
                        <h2>Blog</h2>
                    </div>
                    <Link href="/blog" className="text-link">
                        View all posts
                    </Link>
                </div>
                <div className="blog-grid two-col">
                    {blogs.slice(0, 6).map((post) => (
                        <Link className="blog-card" key={post.slug} href={`/blog/${post.slug}`}>
                            <time>{post.date}</time>
                            <h3>{post.title}</h3>
                            <p>{post.summary}</p>
                            <div className="tag-row">
                                {post.keywords.slice(0, 4).map((keyword) => (
                                    <span key={keyword}>{keyword}</span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            {/*}-<section className="values-band">
                <div className="container values-grid">
                    {values.map((value) => (
                        <article key={value.title}>
                            <span className="value-icon">◆</span>
                            <h3>{value.title}</h3>
                            <p>{value.text}</p>
                        </article>
                    ))}
                </div>
            </section>*/}
            <section className="container section-space">
                <div className="section-heading">
                    <p className="eyebrow">Capabilities</p>
                    <h2>Engineering focus</h2>
                </div>
                <div className="skill-grid">
                    {skills.map((skill, index) => (
                        <article key={skill} className="skill-card">
                            <strong>{String(index + 1).padStart(2, "0")}</strong>
                            <h3>{skill}</h3>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
