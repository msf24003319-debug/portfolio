import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Saba Rasheed — Full Stack Developer',
  description: 'Saba Rasheed builds web and mobile experiences and explores AI, RAG, and computer vision.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}<Toaster theme="dark" richColors closeButton position="bottom-right" /></body></html>;
}
