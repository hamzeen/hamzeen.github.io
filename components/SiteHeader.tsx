import Link from 'next/link';
import SearchBox from './SearchBox';

const links = [
  { href: '/', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Hamzeen home">
          Hamzeen
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <SearchBox variant="compact" />
      </div>
    </header>
  );
}
