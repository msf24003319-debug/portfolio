import { ArrowUpRight, Smartphone, BrainCircuit, ScanLine, Globe } from 'lucide-react';
import { getPortfolio } from '@/lib/portfolio';
import { safeLink } from '@/lib/validation.mjs';
import PortfolioStatus from '@/components/portfolio-status';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Projects — Saba Rasheed', description: 'Explore Saba Rasheed’s mobile, web, AI, and computer vision projects.' };
const icons = [Smartphone, BrainCircuit, ScanLine, Globe];
export default async function ProjectsPage() {
  const { projects, preview, failed } = await getPortfolio();
  return <main id="main" className="container content-page"><PortfolioStatus preview={preview} failed={failed} /><div className="page-heading"><p className="eyebrow">01 / SELECTED WORK</p><h1>Projects<span>.</span></h1><p>From mobile experiences to intelligent systems.</p></div>
    <div className="project-grid">{projects.map((project, index) => {
      const Icon = icons[index % icons.length]; const link = safeLink(project.link);
      return <article className={`project-card project-tone-${index % 4}`} key={project.id}><div className="project-visual"><div className="project-icon"><Icon size={42} strokeWidth={1.25} aria-hidden="true" /></div><span className="project-number">PROJECT / {String(index + 1).padStart(2, '0')}</span><div className="visual-caption">{project.tech_stack?.[0] ?? 'Development'}</div></div><div className="project-content"><h2>{project.title}</h2><p>{project.description}</p><div className="tags">{project.tech_stack?.map((tag) => <span key={tag}>{tag}</span>)}</div>{link && <a className="project-link" href={link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={17} /></a>}</div></article>;
    })}</div>{!projects.length && !failed && <p className="empty-state">New projects are on the way.</p>}
  </main>;
}
