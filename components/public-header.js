'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['/', 'Home'], ['/projects', 'Projects'], ['/experience', 'Experience'],
  ['/skills', 'Skills'], ['/education', 'Education'], ['/contact', 'Contact'],
];
export default function PublicHeader() {
  const pathname = usePathname();
  return <header className="site-header"><nav className="container nav public-nav" aria-label="Main navigation"><Link href="/" className="wordmark" aria-label="Saba Rasheed home">saba<span>.</span></Link><div className="nav-links public-links">{links.map(([href, title]) => <Link href={href} key={href} aria-current={pathname === href ? 'page' : undefined}>{title}</Link>)}</div></nav></header>;
}
