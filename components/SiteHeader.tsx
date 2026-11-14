import Image from "next/image";
import Link from "next/link";
import ActiveNavLinks from "./ActiveNavLinks";
import SearchBox from "./SearchBox";

export default function SiteHeader() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="brand" aria-label="Hamzeen home">
                    <Image
                        src="/calligraphic-label.png"
                        alt=""
                        width={2172}
                        height={724}
                        className="brand-logo"
                    />
                </Link>
                <ActiveNavLinks />
                <SearchBox variant="compact" />
            </div>
        </header>
    );
}
