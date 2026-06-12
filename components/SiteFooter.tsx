export default function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <p>© {new Date().getFullYear()} Hamzeen Hameem</p>
                <p>Designed and built with Next.js, Markdown, Shiki and GitHub Pages.</p>
            </div>
        </footer>
    );
}
