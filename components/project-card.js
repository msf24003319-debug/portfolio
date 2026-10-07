import Image from 'next/image';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { safeLink } from '@/lib/validation.mjs';

export default function ProjectCard({ project, index = 0 }) {
  const imageUrl = safeLink(project.image_url?.trim());
  const link = safeLink(project.link);
  const tags = project.tech_stack ?? [];

  return (
    <article className={`project-card project-tone-${index % 4}`}>
      <div className={`project-visual ${imageUrl ? 'project-visual-image' : 'project-visual-fallback'}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${project.title} project screenshot`}
            fill
            sizes="(max-width: 640px) calc(100vw - 36px), (max-width: 1200px) 46vw, 550px"
            className="project-image"
            unoptimized
          />
        ) : (
          <>
            <span className="project-number">PROJECT / {String(index + 1).padStart(2, '0')}</span>
            <div className="project-icon"><Code2 size={42} strokeWidth={1.25} aria-hidden="true" /></div>
            <div className="tags project-visual-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </>
        )}
      </div>
      <div className="project-content">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        {imageUrl && <div className="tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
        {link && <a className="project-link" href={link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={17} /></a>}
      </div>
    </article>
  );
}
