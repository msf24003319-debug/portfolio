'use client';
import { useState } from 'react';
import { Code2, Smartphone, Server, Database, BrainCircuit, ScanLine } from 'lucide-react';
import { skillGroups } from '@/lib/content';

const icons = { frontend: Code2, mobile: Smartphone, backend: Server, databases: Database, ai: BrainCircuit, vision: ScanLine };

export default function SkillsFilter() {
  const [selectedId, setSelectedId] = useState(skillGroups[0].id);
  const visibleGroups = selectedId === 'all' ? skillGroups : skillGroups.filter((group) => group.id === selectedId);

  return <>
    <div className="stack-navigation" role="group" aria-label="Filter skills by stack">
      <button type="button" aria-pressed={selectedId === 'all'} aria-controls="selected-stack" onClick={() => setSelectedId('all')}>All</button>
      {skillGroups.map((group) => <button type="button" key={group.id} aria-pressed={selectedId === group.id} aria-controls="selected-stack" onClick={() => setSelectedId(group.id)}>{group.name}</button>)}
    </div>
    <div id="selected-stack" className="stack-sections" aria-live="polite" aria-atomic="true">
      {visibleGroups.map((selected) => {
        const Icon = icons[selected.id];
        const index = skillGroups.findIndex((group) => group.id === selected.id);
        return <section key={selected.id} className={`stack-section stack-${selected.id}`} id={`stack-${selected.id}`} aria-labelledby={`stack-title-${selected.id}`}>
        <div className="stack-heading"><span className="stack-icon"><Icon size={25} aria-hidden="true" /></span><div><p className="stack-index">STACK / {String(index + 1).padStart(2, '0')}</p><h2 id={`stack-title-${selected.id}`}>{selected.name}</h2></div></div>
        <ul className="stack-technologies">{selected.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </section>;
      })}
    </div>
  </>;
}
