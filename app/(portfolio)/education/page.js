import { GraduationCap } from 'lucide-react';
export const metadata = { title: 'Education — Saba Rasheed', description: 'Computer science education at the University of Education and COMSATS.' };
export default function EducationPage() {
  return <main id="main" className="container content-page"><div className="page-heading"><p className="eyebrow">04 / THE FOUNDATION</p><h1>Education<span>.</span></h1><p>A foundation in computer science.</p></div><div className="education-grid"><article className="education-card"><GraduationCap size={30} aria-hidden="true" /><p className="experience-date">2026</p><h2>Master of Computer Science</h2><p>University of Education</p></article><article className="education-card"><GraduationCap size={30} aria-hidden="true" /><p className="experience-date">2024</p><h2>BS Computer Science</h2><p>COMSATS</p></article></div></main>;
}
