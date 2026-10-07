import SkillsFilter from '@/components/skills-filter';
export const metadata = { title: 'Skills — Saba Rasheed', description: 'Frontend, mobile, backend, database, AI, and computer vision technology stacks.' };
export default function SkillsPage() {
  return <main id="main" className="container content-page"><div className="page-heading"><p className="eyebrow">03 / MY TOOLKIT</p><h1>Skills & stacks<span>.</span></h1><p>The right tools. A curious mind.</p></div><SkillsFilter /></main>;
}
