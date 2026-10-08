import { ArrowUpRight, Mail, Github, Linkedin, Phone } from 'lucide-react';
export const metadata = { title: 'Contact — Saba Rasheed', description: 'Contact Saba Rasheed by email or phone, or connect on LinkedIn and GitHub.' };
const contacts = [
  { name: 'Email', value: 'sabarasheed458@gmail.com', href: 'mailto:sabarasheed458@gmail.com', icon: Mail },
  { name: 'GitHub', value: 'github.com/saba054', href: 'https://github.com/saba054', icon: Github, external: true },
  { name: 'LinkedIn', value: 'www.linkedin.com/in/sabarasheeddev', href: 'https://www.linkedin.com/in/sabarasheeddev', icon: Linkedin, external: true },
  { name: 'Phone', value: '03120613945', href: 'tel:+923120613945', icon: Phone },
];
export default function ContactPage() {
  return <main id="main" className="container content-page"><div className="page-heading"><p className="eyebrow">05 / LET’S CONNECT</p><h1>Have an idea in mind<span>?</span></h1><p>I’d love to hear about it.</p></div><div className="contact-grid">{contacts.map(({ name, value, href, icon: Icon, external }) => <a className="contact-card" key={name} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}><Icon size={26} aria-hidden="true" /><div><h2>{name}</h2><p>{value}</p></div><ArrowUpRight size={20} aria-hidden="true" /></a>)}</div></main>;
}
