import { GraduationCap, ArrowUpRight } from 'lucide-react';
import { getPortfolio } from '@/lib/portfolio';
import { safeLink } from '@/lib/validation.mjs';
import PortfolioStatus from '@/components/portfolio-status';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Education \u2014 Saba Rasheed', description: 'A foundation in computer science.' };
export default async function Page() {
  const data = await getPortfolio();
  const records = data.education;
  const failed = data.educationFailed;
  return <main id="main" className="container content-page"><PortfolioStatus preview={data.preview} failed={failed} /><div className="page-heading"><p className="eyebrow">04 / THE FOUNDATION</p><h1>Education<span>.</span></h1><p>A foundation in computer science.</p></div><div className="education-grid">{records.map((record) => {
    const link = safeLink(record.link);
    return <article className="education-card" key={record.id}><GraduationCap size={30} aria-hidden="true" /><p className="experience-date">{record.duration}</p><h2>{record.degree}</h2><p>{record.institution}</p>{record.description && <p className="qualification-description">{record.description}</p>}{link && <a className="project-link" href={link} target="_blank" rel="noopener noreferrer">View credential <ArrowUpRight size={17} /></a>}</article>;
  })}</div>{!records.length && !failed && <p className="empty-state">No education added yet.</p>}</main>;
}
