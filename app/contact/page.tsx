export const metadata = {
    title: "Contact | Hamzeen",
    description: "Contact Hamzeen Hameem.",
};

export default function ContactPage() {
    return (
        <main className="container page-shell narrow-page">
            <section className="page-hero compact-page-hero">
                <p className="eyebrow">Contact</p>
                <h1>Let’s talk!</h1>
                <p>Reach out if you would like to collaborate.</p>
            </section>

            <section className="content-panel contact-panel">
                <a href="https://github.com/hamzeen" target="_blank" rel="noreferrer">
                    GitHub
                </a>
                <a href="https://medium.com/@hamzeen" target="_blank" rel="noreferrer">
                    Medium
                </a>
                <a href="https://www.linkedin.com/in/hamzeen/" target="_blank" rel="noreferrer">
                    LinkedIn
                </a>
            </section>
        </main>
    );
}
