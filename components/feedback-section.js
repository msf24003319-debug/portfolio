'use client';

import { useActionState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { submitFeedback } from '@/app/(portfolio)/feedback-actions';

export default function FeedbackSection({ entries, configured, failed }) {
  const [state, action, pending] = useActionState(submitFeedback, {});
  return <section id="feedback" className="container section feedback-section" aria-labelledby="feedback-title">
    <div className="section-heading"><div><p className="eyebrow">CUSTOMER FEEDBACK</p><h2 id="feedback-title">Your experience matters<span>.</span></h2></div><p>Worked with me? Share your experience with future customers.</p></div>
    <div className="feedback-layout">
      <form action={action} className="feedback-form">
        <MessageSquare size={25} className="teal" aria-hidden="true" />
        <h3>Leave your feedback</h3>
        <p>Your name, rating, and message will appear publicly on this portfolio.</p>
        <label htmlFor="feedback-name">Your name</label>
        <input id="feedback-name" name="name" autoComplete="name" required maxLength={80} placeholder="Your name" disabled={!configured || pending} />
        <fieldset disabled={!configured || pending}><legend>Your rating</legend><div className="feedback-rating">{[1, 2, 3, 4, 5].map(value => <label key={value}><input type="radio" name="rating" value={value} required defaultChecked={value === 5} /><span>{value} <Star size={14} aria-hidden="true" /></span><span className="feedback-sr">out of 5 stars</span></label>)}</div></fieldset>
        <label htmlFor="feedback-message">Your feedback</label>
        <textarea id="feedback-message" name="message" rows={5} required minLength={10} maxLength={1500} placeholder="Tell us about working together…" disabled={!configured || pending} />
        <button className="button primary" type="submit" disabled={!configured || pending}>{pending ? 'Submitting…' : 'Submit feedback'}</button>
        <div aria-live="polite" role="status">{state.error && <p className="feedback-error">{state.error}</p>}{state.success && <p className="feedback-success">Thank you! Your feedback is now displayed on the portfolio.</p>}</div>
        {!configured && <p className="feedback-note">Feedback submissions will open soon.</p>}
      </form>
      <div className="feedback-list" aria-label="Customer feedback">
        {failed && <p className="notice" role="status">Feedback could not be loaded. Please try again later.</p>}
        {!failed && !entries.length && <div className="feedback-empty"><MessageSquare size={32} aria-hidden="true" /><h3>Be the first to share</h3><p>Your feedback helps others get to know my work.</p></div>}
        {entries.map(entry => <article className="feedback-card" key={entry.id}><div className="feedback-stars" aria-label={`${entry.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map(value => <Star key={value} size={17} aria-hidden="true" fill={value <= entry.rating ? 'currentColor' : 'none'} />)}</div><p className="feedback-message">{entry.message}</p><footer><strong>{entry.name}</strong><time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></footer></article>)}
      </div>
    </div>
  </section>;
}
