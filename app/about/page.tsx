export const metadata = {
    title: "About | Hamzeen",
    description: "About Hamzeen Hameem.",
};

export default function AboutPage() {
    return (
        <main className="container page-shell narrow-page">
            <section className="page-hero compact-page-hero">
                <p className="eyebrow">About</p>
                <h1>Architecture-minded full stack engineer.</h1>
                <p>Hamzeen specializes in Solution Architecture, Clean Code and Design Systems.</p>
            </section>

            <section className="content-panel">
                <p>
                    He has architected micro-frontend platforms, event-driven backends and real-time
                    systems, with scalability, reliability and observability at the core.
                </p>
                <p>
                    He is hands-on across Node.js, TypeScript, Java, Spring Boot, Angular, React and
                    Vue, with 15+ years of industry experience.
                </p>
                <p>
                    Hamzeen graduated from the University of Westminster, London, with a BSc (Hons)
                    in Software Engineering, earning First Class Honours.
                </p>
            </section>
        </main>
    );
}
