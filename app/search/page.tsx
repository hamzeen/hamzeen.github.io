import SearchBox from '@/components/SearchBox';

export const metadata = {
  title: 'Search | Hamzeen',
  description: 'Search portfolio pages, blog posts and keywords.'
};

export default function SearchPage() {
  return (
    <main className="container page-shell narrow-page">
      <section className="page-hero compact-page-hero">
        <p className="eyebrow">Search</p>
        <h1>Search the portfolio and blog.</h1>
      </section>
      <SearchBox variant="large" />
    </main>
  );
}
