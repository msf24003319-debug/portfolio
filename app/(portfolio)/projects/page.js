import ProjectCard from '@/components/project-card';
import { getPortfolio } from '@/lib/portfolio';
import PortfolioStatus from '@/components/portfolio-status';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Projects — Saba Rasheed', description: 'Explore Saba Rasheed’s mobile, web, AI, and computer vision projects.' };
export default async function ProjectsPage() {
  const { projects, preview, failed } = await getPortfolio();
  return <main id="main" className="container content-page"><PortfolioStatus preview={preview} failed={failed} /><div className="page-heading"><p className="eyebrow">01 / SELECTED WORK</p><h1>Projects<span>.</span></h1><p>From mobile experiences to intelligent systems.</p></div>
    <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>{!projects.length && !failed && <p className="empty-state">New projects are on the way.</p>}
  </main>;
}
