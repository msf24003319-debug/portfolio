import Link from 'next/link';
import { ArrowUpRight, Download, Code2 } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/config';
import PortfolioStatus from '@/components/portfolio-status';

export default function HomePage() {
  return <main id="main" className="home-main">
    <div className="container"><PortfolioStatus preview={!isSupabaseConfigured()} /></div>
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero-copy"><div className="eyebrow"><span className="short-line" /> WEB. MOBILE. INTELLIGENCE.</div>
        <p className="intro">Hello, I’m Saba Rasheed</p>
        <h1 id="hero-title">Thoughtful code.<br /><span className="gradient-text">Real possibilities.</span></h1>
        <p className="hero-title">Full Stack Developer <span>|</span> Mobile App & AI Enthusiast</p>
        <p className="hero-description">I build connected web and mobile experiences, and explore how AI can turn complex ideas into useful tools.</p>
        <div className="hero-actions"><Link className="button primary" href="/projects">Explore my work <ArrowUpRight size={18} /></Link><a className="button secondary" href="/api/cv" download="Saba-Rasheed-CV.pdf"><Download size={17} /> Download CV</a></div>
        <div className="social-links"><Link href="/experience">My journey</Link><Link href="/contact">Let’s talk</Link></div>
      </div>
      <div className="code-card" aria-label="Saba’s development focus"><div className="code-toolbar"><span /><span /><span /><p>developer.js</p><Code2 size={16} /></div>
        <div className="code-body"><p><span className="purple">const</span> <span className="teal">developer</span> = {'{'}</p><p className="code-indent">name: <span className="code-string">'Saba Rasheed'</span>,</p><p className="code-indent">focus: [</p><p className="code-indent-double code-string">'Full Stack',</p><p className="code-indent-double code-string">'Mobile Apps',</p><p className="code-indent-double code-string">'Artificial Intelligence'</p><p className="code-indent">],</p><p className="code-indent">mindset: <span className="code-string">'Always building'</span></p><p>{'}'};</p><p className="code-comment">// From an idea to something that works.</p></div>
        <div className="code-bottom"><span>Curiosity → creation</span><span className="teal">&lt;/&gt;</span></div>
      </div>
    </section>
    <div className="container focus-strip"><span>Building across the stack</span><div><span>React & Next.js</span><span>React Native</span><span>Supabase</span><span>Python & AI</span></div></div>
  </main>;
}
