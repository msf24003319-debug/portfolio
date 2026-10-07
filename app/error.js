'use client';
export default function ErrorPage({ reset }) { return <main id="main" className="container loading-state"><h1>Something went wrong.</h1><p>Please try again in a moment.</p><button className="button primary" onClick={reset}>Try again</button><a className="muted-link" href="/">Back to portfolio</a></main>; }
