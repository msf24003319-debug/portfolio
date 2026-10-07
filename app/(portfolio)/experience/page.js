import { getPortfolio } from '@/lib/portfolio';
import PortfolioStatus from '@/components/portfolio-status';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Experience — Saba Rasheed', description: 'Saba Rasheed’s journey in full stack and mobile application development.' };
export default async function ExperiencePage() {
  const { experience, preview, failed } = await getPortfolio();
  return <main id="main" className="container content-page"><PortfolioStatus preview={preview} failed={failed} /><div className="page-heading"><p className="eyebrow">02 / THE JOURNEY</p><h1>Experience<span>.</span></h1><p>Learning by building, one challenge at a time.</p></div><div className="timeline experience-page-timeline">{experience.map((item) => <article className="experience-card" key={item.id}><span className="timeline-marker" /><p className="experience-date">{item.duration}</p><h2>{item.role}</h2><p className="experience-company">{item.company}</p><p className="experience-description">{item.description}</p></article>)}</div>{!experience.length && !failed && <p className="empty-state">Experience updates coming soon.</p>}</main>;
}
