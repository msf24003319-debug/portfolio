'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BriefcaseBusiness, FolderCode, LogOut, Pencil, Trash2, Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { saveRecord, deleteRecord } from '@/app/admin/actions';

function RecordForm({ kind, record, onDone, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const project = kind === 'projects';
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const form = event.currentTarget;
    try {
      const result = await saveRecord(kind, Object.fromEntries(new FormData(form)), record?.id);
      if (result.error) { setError(result.error); toast.error(result.error); }
      else { toast.success(`${project ? 'Project' : 'Experience'} ${record ? 'updated' : 'added'} successfully.`); form.reset(); onDone(); }
    } catch { setError('The connection failed. Please try again.'); toast.error('The connection failed. Please try again.'); }
    finally { setBusy(false); }
  }
  return <form className="record-form" onSubmit={submit} key={record?.id ?? kind}><div className="form-title"><h2>{record ? 'Edit' : 'Add'} {project ? 'project' : 'experience'}</h2>{record && <button type="button" className="icon-button" aria-label="Cancel editing" onClick={onCancel} disabled={busy}><X size={18} /></button>}</div><fieldset disabled={busy}>
    {project ? <><label>Project title<input name="title" required maxLength={120} defaultValue={record?.title ?? ''} placeholder="What did you build?" /></label><label>Tech stack<span className="field-help">Separate technologies with commas.</span><input name="tech_stack" required maxLength={1000} defaultValue={record?.tech_stack?.join(', ') ?? ''} placeholder="Next.js, Supabase, Tailwind CSS" /></label><label>Project link <span className="field-help inline">optional</span><input name="link" type="url" maxLength={2048} defaultValue={record?.link ?? ''} placeholder="https://example.com" /></label></> : <><label>Role<input name="role" required maxLength={120} defaultValue={record?.role ?? ''} placeholder="Full Stack Developer" /></label><label>Company<input name="company" required maxLength={120} defaultValue={record?.company ?? ''} /></label><div className="form-row"><label>Duration<input name="duration" required maxLength={100} defaultValue={record?.duration ?? ''} placeholder="01/2025–Present" /></label><label>Display order<input name="order_id" type="number" required min={0} max={10000} step={1} defaultValue={record?.order_id ?? 0} /></label></div><p className="field-help">Lower display orders appear first.</p></>}
    <label>Description<textarea name="description" rows={4} required maxLength={3000} defaultValue={record?.description ?? ''} placeholder={project ? 'Describe the project and what it does.' : 'Describe your responsibilities and contributions.'} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}<button className="button primary" disabled={busy}><Plus size={17} />{busy ? 'Saving…' : record ? 'Save changes' : project ? 'Add project' : 'Add experience'}</button>
  </fieldset></form>;
}

export default function AdminDashboard({ email, projects, experience, loadError }) {
  const router = useRouter();
  const [kind, setKind] = useState('projects');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const records = kind === 'projects' ? projects : experience;
  async function remove(record) {
    if (!window.confirm(`Delete “${record.title ?? record.role}”? This removes it from your public portfolio.`)) return;
    setDeleting(record.id);
    try { const result = await deleteRecord(kind, record.id); if (result.error) toast.error(result.error); else { toast.success('Record deleted.'); if (editing?.id === record.id) setEditing(null); router.refresh(); } }
    catch { toast.error('The connection failed. Please try again.'); }
    finally { setDeleting(null); }
  }
  async function logout() {
    setLoggingOut(true);
    try { const { error } = await createClient().auth.signOut(); if (error) throw error; window.location.assign('/admin/login'); }
    catch { toast.error('Unable to sign out. Please try again.'); setLoggingOut(false); }
  }
  return <><header className="site-header"><div className="container nav"><a href="/" className="wordmark">saba<span>.</span></a><span className="dashboard-label">Portfolio workspace</span><button className="button secondary compact" onClick={logout} disabled={loggingOut}><LogOut size={16} />{loggingOut ? 'Signing out…' : 'Sign out'}</button></div></header><main id="main" className="container dashboard"><div className="section-heading"><div><p className="eyebrow">ADMIN DASHBOARD</p><h1>Your work, up to date<span>.</span></h1><p className="form-description">Signed in as {email}</p></div><a href="/" className="button secondary">View portfolio</a></div>{loadError && <p role="alert" className="notice">Records could not be loaded. Check your database setup and refresh.</p>}<div className="dashboard-stats"><div><FolderCode size={21} /><strong>{projects.length}</strong><span>Projects</span></div><div><BriefcaseBusiness size={21} /><strong>{experience.length}</strong><span>Experiences</span></div></div><div className="admin-tabs" role="group" aria-label="Content type"><button aria-pressed={kind === 'projects'} onClick={() => { setKind('projects'); setEditing(null); }}>Projects</button><button aria-pressed={kind === 'experience'} onClick={() => { setKind('experience'); setEditing(null); }}>Experience</button></div><div className="admin-grid"><RecordForm key={`${kind}-${editing?.id ?? 'new'}`} kind={kind} record={editing} onCancel={() => setEditing(null)} onDone={() => { setEditing(null); router.refresh(); }} /><section className="record-list" aria-label={kind === 'projects' ? 'Saved projects' : 'Saved experiences'}><h2>Published {kind === 'projects' ? 'projects' : 'experiences'}</h2>{!records.length && <p className="empty-state">No records yet. Add your first one using the form.</p>}{records.map((record) => <article key={record.id} className="admin-record"><div><h3>{record.title ?? record.role}</h3>{record.company && <p className="teal">{record.company} · {record.duration}</p>}<p>{record.description}</p>{record.tech_stack && <div className="tags">{record.tech_stack.map((tag) => <span key={tag}>{tag}</span>)}</div>}</div><div className="record-actions"><button className="icon-button" aria-label={`Edit ${record.title ?? record.role}`} onClick={() => { setEditing(record); }} disabled={Boolean(deleting)}><Pencil size={17} /></button><button className="icon-button danger" aria-label={`Delete ${record.title ?? record.role}`} onClick={() => remove(record)} disabled={Boolean(deleting)}><Trash2 size={17} /></button></div></article>)}</section></div></main></>;
}
