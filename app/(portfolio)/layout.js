import Link from 'next/link';
import PublicHeader from '@/components/public-header';

// Shared public navigation stays separate from the protected admin workspace.
export default function PortfolioLayout({ children }) {
  return <div className="public-shell"><PublicHeader />{children}<footer className="container footer"><span>© {new Date().getUTCFullYear()} Saba Rasheed</span><div><Link href="/contact">Contact & links</Link><Link href="/admin">Admin</Link></div></footer></div>;
}
