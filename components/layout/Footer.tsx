import Link from "next/link";

const columns = [
  {
    title: "Solutions",
    links: [
      { href: "/resources", label: "Living Room Design" },
      { href: "/resources", label: "Virtual Staging" },
      { href: "/resources", label: "Backyard Design" },
      { href: "/resources", label: "Small Living Room" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/features", label: "Examples" },
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
    <footer className="border-t border-white/10 bg-brand-navy text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <span className="font-heading text-lg font-semibold text-white">VastuNord</span>
            <p className="mt-3 max-w-xs text-sm">
              Visualize spatial possibilities. Make confident decisions before you invest.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} VastuNord. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
