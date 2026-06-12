import fs from "node:fs";
import path from "node:path";
import { getAllBlogs, getAllKeywordTopics } from "../lib/blogs";

const SITE_URL = "https://hamzeen.github.io";

const publicDir = path.join(process.cwd(), "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

function formatDate(date?: string) {
    if (!date) return new Date().toISOString().split("T")[0];

    return new Date(date).toISOString().split("T")[0];
}

function createUrlEntry({
    url,
    lastmod,
    priority = "0.7",
}: {
    url: string;
    lastmod?: string;
    priority?: string;
}) {
    return `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${formatDate(lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
    const [blogs, topics] = await Promise.all([getAllBlogs(), getAllKeywordTopics()]);

    const staticRoutes = [
        { url: "/", priority: "1.0" },
        { url: "/about", priority: "0.8" },
        { url: "/contact", priority: "0.7" },
        { url: "/blog", priority: "0.9" },
        { url: "/search", priority: "0.6" },
        { url: "/topics", priority: "0.7" },
    ];

    const blogRoutes = blogs.map((post) => ({
        url: `/blog/${post.slug}`,
        lastmod: post.date,
        priority: "0.8",
    }));

    const topicRoutes = topics.map((topic) => ({
        url: `/topics/${topic.slug}`,
        priority: "0.6",
    }));

    const entries = [...staticRoutes, ...blogRoutes, ...topicRoutes].map(createUrlEntry).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

    fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(sitemapPath, sitemap.trim());

    console.log(
        `Generated sitemap.xml with ${staticRoutes.length + blogRoutes.length + topicRoutes.length} routes`
    );
}

generateSitemap();
