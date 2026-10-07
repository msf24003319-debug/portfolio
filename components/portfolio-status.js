export default function PortfolioStatus({ preview, failed }) {
  return <>{preview && <p className="preview-note">Content preview · Connect Supabase to publish and manage your portfolio.</p>}{failed && <p className="notice" role="status">Some portfolio content is temporarily unavailable. Please try again shortly.</p>}</>;
}
