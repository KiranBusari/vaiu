import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Logo2 } from "@/components/Logo2";

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  const supportLinks = [
    { label: "Contact", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/KiranBusari/vaiu",
    },
  ];

  return (
    <footer className="w-full border-t dark:border-slate-800 border-slate-200 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        {/* Main Footer Content */}
        <div className="flex justify-between items-start mb-12">
          {/* Branding - Column 1 */}
          <div className="">
            <Link href="/" className="inline-flex items-center hover:opacity-80 transition-opacity mb-4">
              <Logo className="dark:hidden h-8 w-auto" />
              <Logo2 className="hidden dark:block h-8 w-auto" />
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Empowering teams to collaborate and build together.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">

            {/* Support Links - Column 2 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Support
              </h3>
              <nav className="space-y-3">
                {supportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect - Column 4 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Connect
              </h3>
              <nav className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="mailto:contact@vaiu.com"
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Email
                </a>
              </nav>
            </div>

            {/* Resources Links - Column 3 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Resources
              </h3>
              <nav className="space-y-3">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

          </div>
        </div>
        {/* Divider */}
        <div className="border-t dark:border-slate-800 border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <p>© {CURRENT_YEAR} Vaiu. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
