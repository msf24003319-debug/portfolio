import { ArrowUpRight, Mail, Github, Globe } from 'lucide-react';
export const metadata = { title: 'Contact — Saba Rasheed', description: 'Contact Saba Rasheed by email and explore her GitHub and website links.' };
const contacts = [
  { name: 'Email', value: 'sabarasheed458@gmail.com', href: 'mailto:sabarasheed458@gmail.com', icon: Mail },
  { name: 'GitHub', value: 'github.com/saba054', href: 'https://github.com/saba054', icon: Github, external: true },
  { name: 'ANAYANEX', value: 'anayanex.com', href: 'https://anayanex.com', icon: Globe, external: true },
  { name: 'Lion Forex Academy', value: 'lionforexacademy.com', href: 'https://lionforexacademy.com', icon: Globe, external: true },
];
export default function ContactPage() {
  return <main id="main" className="container content-page"><div className="page-heading"><p className="eyebrow">05 / LET’S CONNECT</p><h1>Have an idea in mind<span>?</span></h1><p>I’d love to hear about it.</p></div><div className="contact-grid">{contacts.map(({ name, value, href, icon: Icon, external }) => <a className="contact-card" key={name} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}><Icon size={26} aria-hidden="true" /><div><h2>{name}</h2><p>{value}</p></div><ArrowUpRight size={20} aria-hidden="true" /></a>)}</div></main>;
}
