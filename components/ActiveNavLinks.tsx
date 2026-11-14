"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function ActiveNavLinks() {
    const pathname = usePathname();

    return (
        <nav className="nav-links" aria-label="Main navigation">
            {links.map((link) => {
                const active =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(`${link.href}/`));

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={
                            active ? (pathname === link.href ? "page" : "location") : undefined
                        }>
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
