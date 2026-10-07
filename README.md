# Saba Rasheed — portfolio

A complete JavaScript Next.js App Router project with Tailwind CSS v4, Lucide icons, Supabase PostgreSQL/Auth, and Sonner toasts. The public page is responsive and uses dark surfaces with teal and purple accents. The admin supports adding, editing, and deleting projects and experiences.

## Run locally

Use Node.js 20.9 or newer (Node.js 24 LTS recommended).

```powershell
npm.cmd install
Copy-Item .env.example .env.local
# Fill in .env.local before starting for live database/auth.
npm.cmd run dev
```

Open http://localhost:3000. The home page contains your introduction and CV download. Projects, Experience, Skills, Education, and Contact have separate pages linked in the shared navigation. Without Supabase variables, projects and experience show the supplied initial content as a labeled preview. Login is disabled. Once configured, projects and experiences always come from Supabase: empty tables stay empty, and database failures display an error instead of stale sample records.

## Supabase setup

1. Create a Supabase project. In its Connect dialog, copy the project URL and **publishable key** into `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

   The legacy anon key also works in the publishable-key variable. Never put a service-role or secret key in a `NEXT_PUBLIC_*` variable.

2. Run `supabase/schema.sql` in the SQL editor, then run `supabase/seed.sql` to insert your four projects and two experiences. Seed reruns do not overwrite edits. Use a fresh database or review existing policies first: PostgreSQL permissive policies combine with OR, so previously installed write policies could weaken this setup.
3. Enable email/password authentication. Turn off **Allow new users to sign up** in Authentication settings. This application deliberately offers no sign-up form.
4. Create your admin email/password user in Authentication → Users. Choose a strong password and confirm the email through the supported dashboard flow.
5. Copy that user's UUID into `supabase/admin.sql`, replacing `REPLACE_WITH_ADMIN_USER_UUID`, and run the SQL. This marks the chosen user with trusted `app_metadata.portfolio_admin = true`. Sign out and back in after changing metadata to refresh the JWT.
6. Set your Supabase Auth Site URL to your production origin (or localhost while developing). Restart Next.js after changing environment variables.
7. Visit `/admin/login`. `/admin` redirects unauthenticated users to login. Accounts lacking the admin claim cannot use the dashboard or mutations.

RLS permits anonymous and authenticated reads and restricts inserts, updates, and deletes to **authenticated admin users**. This is stricter than allowing every authenticated account to edit a personal portfolio. Authorization runs at both the server action and database layers. Admin pages validate the user against Supabase Auth; the Next.js proxy refreshes auth cookies. RLS trusts administrator-controlled `app_metadata`, not editable `user_metadata`. Changes to metadata take effect in RLS after token refresh; revoke active sessions when removing access.

## Project structure

```text
app/
  (portfolio)/              Public route group (not part of URLs)
    layout.js               Shared public header and footer
    page.js                 Home introduction and CV download
    projects/page.js        /projects; live Supabase projects
    experience/page.js      /experience; live Supabase experience
    skills/page.js          /skills; filter between six technology stacks
    education/page.js       /education; qualifications
    contact/page.js         /contact; email, GitHub, and website links
  layout.js                 Metadata, stylesheet, toast provider
  globals.css               Tailwind import and responsive design
  loading.js / error.js      Loading and failure states
  admin/
    page.js                 Server-protected dashboard route
    actions.js              Authorized CRUD and server input validation
    login/page.js           Email/password login page
  api/cv/route.js            Downloadable PDF generated from current content
components/
  public-header.js          Responsive page links and active navigation
  skills-filter.js          Show only the selected technology stack
  portfolio-status.js       Preview and database error notices
  admin-dashboard.js        Add/edit forms, saved records, deletion, toasts
  login-form.js             Supabase Auth sign-in
lib/
  supabase.js               Browser Supabase initialization
  supabase-server.js        Cookie-aware server and anonymous public clients
  config.js                 Environment configuration
  portfolio.js              Live project/experience queries
  content.js                Initial preview and static skills
  validation.mjs            Shared input and safe URL validation
  cv.js                     Paginated PDF generation
supabase/
  schema.sql                Tables, constraints, indexes, grants, RLS
  seed.sql                  Initial portfolio records
  admin.sql                 Assign the chosen admin UUID
tests/validation.test.mjs    Validation/security regression checks
public/favicon.svg
proxy.js                    Admin session refresh (Next.js 16)
.env.example
next.config.mjs
postcss.config.mjs
jsconfig.json
package.json
package-lock.json
```

## Content and behavior

- Projects are ordered by newest creation time; experience is ordered by ascending `order_id`. Set 0 for the first experience, 1 for the next, and so on.
- Project links are optional. Only HTTP(S) URLs without embedded credentials are accepted. Links were not invented for projects with no supplied URL.
- Skills, education, name, and contact details are static in `lib/content.js` and the corresponding pages under `app/(portfolio)/`. Dynamic project and experience descriptions are rendered as plain text.
- The CV button downloads a real PDF generated from current database records plus your skills, education, and contact information. You can replace it with your own polished PDF by putting it in `public/Saba-Rasheed-CV.pdf` and updating the hero link.
- Server actions validate all input, confirm the admin identity, and rely on RLS. Successful changes refresh the dashboard and revalidate the relevant projects or experience route. These public pages fetch on each request, so the next page load shows updates.
- No photo, project screenshots, or unavailable repository URLs were fabricated.

## Verification and deployment

```powershell
npm.cmd test
npm.cmd run build
npm.cmd start
```

With the production server running and no Supabase environment variables set, `node tests/smoke.mjs` checks all six public routes, content separation, active navigation, the protected admin redirect, disabled login, response headers, and generated PDF structure.

Deploy to a Next.js-compatible Node.js host (for example Vercel) and set the same two environment variables in the hosting environment. This project uses server rendering, Server Actions, and PDF generation; it is not a static export. Keep admin responses private and do not override the proxy's `Cache-Control: private, no-store` with CDN caching. Use HTTPS in production.

Live acceptance checks after Supabase setup:

1. Anonymous visitors can see seeded projects and experiences. Direct anonymous database insert/update/delete requests are rejected.
2. `/admin` redirects without a valid session. A non-admin authenticated account cannot mutate either table, even via direct Supabase API calls.
3. The designated admin can add, edit, and delete both record types, gets success toasts, and sees changes on the public page after refresh.
4. Sign out; reload `/admin` and confirm it redirects to login. Check an expired session is refreshed by the proxy.
5. Download and open the CV. Test mobile and keyboard navigation; verify focus indicators and form errors.

Live authentication and RLS verification require your configured Supabase project; the local preview cannot exercise them.

Implementation references: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy).

## Project images

The project admin form accepts an optional public HTTP(S) image URL. Clear it to use the dark gradient fallback with a code icon and technology badges. Images use Next.js `Image` with responsive sizing and a subtle hover zoom that respects reduced-motion preferences. Images are served directly (`unoptimized`) to support public image hosts without a broad server-side image optimizer allowlist.

For an existing database, run `supabase/migrations/20261007_project_images.sql` in the Supabase SQL editor before saving projects. Fresh databases get the column from `supabase/schema.sql`. Existing projects keep the fallback until you add an image URL.

### Upload images from your device

Run `supabase/migrations/20261007_project_image_uploads.sql` in the Supabase SQL editor for both fresh and existing installations. It includes the image column, creates the public `project-images` bucket with a 5 MB limit and JPG/PNG/WebP/GIF restrictions, and permits uploads only for authenticated portfolio admins. No service-role key is needed.

Choose a file in the project form to preview it, then save the project. A selected file takes priority over the URL. The browser uploads directly to Supabase Storage and saves its public URL in `image_url`. Clear the URL and remove any selected file to restore the fallback. If saving fails after upload, the URL stays in the form so retrying does not upload another copy. Previously uploaded files remain in Storage when a project is removed or its image is replaced; remove unused files through the Supabase Storage dashboard.

Upload implementation follows [Supabase standard uploads](https://supabase.com/docs/guides/storage/uploads/standard-uploads) and [Storage bucket access controls](https://supabase.com/docs/guides/storage/buckets/fundamentals).
