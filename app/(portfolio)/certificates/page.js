import { Award, ArrowUpRight } from 'lucide-react';
import { getPortfolio } from '@/lib/portfolio';
import { safeLink } from '@/lib/validation.mjs';
import PortfolioStatus from '@/components/portfolio-status';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Certificates \u2014 Saba Rasheed', description: 'Credentials and learning milestones.' };
export default async function Page() {
  const data = await getPortfolio();
  const records = data.certificates;
  const failed = data.certificatesFailed;
  return <main id="main" className="container content-page"><PortfolioStatus preview={data.preview} failed={failed} /><div className="page-heading"><p className="eyebrow">05 / CONTINUED LEARNING</p><h1>Certificates<span>.</span></h1><p>Credentials and learning milestones.</p></div><div className="education-grid">{records.map((record) => {
    const link = safeLink(record.link);
    return <article className="education-card" key={record.id}><Award size={30} aria-hidden="true" /><p className="experience-date">{record.duration}</p><h2>{record.title}</h2><p>{record.issuer}</p>{record.description && <p className="qualification-description">{record.description}</p>}{link && <a className="project-link" href={link} target="_blank" rel="noopener noreferrer">View credential <ArrowUpRight size={17} /></a>}</article>;
  })}</div>{!records.length && !failed && <p className="empty-state">No certificates added yet.</p>}</main>;
}
