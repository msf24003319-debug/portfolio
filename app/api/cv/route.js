import { getPortfolio } from '@/lib/portfolio';
import { buildCv } from '@/lib/cv';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  const data = await getPortfolio();
  if (data.failed) return new Response('Unable to generate your CV right now. Please try again shortly.', { status: 503 });
  return new Response(new Uint8Array(buildCv(data)), { headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="Saba-Rasheed-CV.pdf"',
    'Cache-Control': 'no-store',
  } });
}
