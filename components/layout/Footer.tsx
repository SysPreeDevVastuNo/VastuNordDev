import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Solutions",
    links: [
      { href: "/features", label: "Living Room Design" },
      { href: "/resources", label: "Virtual Staging" },
      { href: "/resources", label: "Backyard Design" },
      { href: "/resources", label: "Scandinavian Living Room" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/resources", label: "Examples" },
      { href: "/features", label: "Use Cases" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/resources", label: "Resources" },
      { href: "/contact", label: "Sign In" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/contact", label: "Privacy" },
      { href: "/contact", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-brand-offwhite">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] lg:gap-10 lg:px-14 lg:py-20">
        <div>
          <Link href="/" aria-label="VastuNord home" className="inline-block">
            <Image src="/brand/vastunord-logo.svg" alt="" width={260} height={24} className="h-6 w-auto" />
          </Link>
          <p className="mt-6 max-w-[320px] leading-6 text-stone-500">
            Visualize spatial possibilities. Make confident decisions before you invest.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="eyebrow font-sans text-stone-400">{col.title}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label} className="text-[15px] leading-[22.5px]">
                  <Link href={link.href} className="text-stone-700 transition-colors hover:text-brand-teal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-stone-200 px-6 py-7 text-sm leading-5 text-stone-400 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <p>© {new Date().getFullYear()} VastuNord</p>
        <p>Spatial visualization for homes, interiors, exteriors and property.</p>
      </div>
    </footer>
  );
}
