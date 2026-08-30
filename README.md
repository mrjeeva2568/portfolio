# Developer Portfolio with Admin CMS

A production-quality, fully dynamic developer portfolio built with Next.js, TypeScript, Tailwind CSS, and Firebase. Every piece of content — profile info, education, skills, projects, certifications, and resume — is managed through a secure Admin Panel and stored in Firestore. **Nothing is hard-coded.**

---

## 1. Overview

- **Public site**: Home, About, Education, Skills, Projects (list + detail), Certifications, Resume, Contact
- **Admin CMS**: Login, Dashboard, Profile, Education, Skills, Projects, Certifications, Messages, Resume, Settings
- Full CRUD (create, read, update, delete, reorder, show/hide, feature) for every content type
- Dark/light/system theme, responsive on mobile/tablet/desktop, subtle Framer Motion animations
- Firebase Authentication protects all `/admin` routes
- Firestore Security Rules enforce public-read / admin-write at the database level (not just UI hiding)

---

## 2. Technology Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + custom UI components (shadcn-style) |
| Icons | Lucide React |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Firebase Authentication, Cloud Firestore, Firebase Storage |
| Notifications | Sonner (toasts) |
| Deployment | Vercel-ready |

---

## 3. Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home
│   ├── about/, projects/, certifications/, contact/, resume/
│   └── admin/
│       ├── login/, dashboard/, profile/, education/, skills/
│       ├── projects/, certifications/, contact/, resume/, settings/
├── components/
│   ├── portfolio/    # Public-facing sections (Hero, About, ProjectCard, etc.)
│   ├── admin/        # Admin shell, sidebar, data table, protected route
│   ├── ui/            # Reusable primitives (button, input, dialog, etc.)
│   └── shared/        # Loading/empty/error states, file uploader, theme
├── lib/
│   ├── firebase/      # config.ts, firestore.ts, storage.ts
│   ├── auth/          # Auth context/hook
│   ├── validations/   # Zod schemas
│   └── utils/
├── hooks/
├── types/             # All TypeScript interfaces
└── config/
scripts/
└── seed.mjs           # Demo data seeder
firestore.rules
storage.rules
firebase.json
```

---

## 4. Installation

```bash
npm install
```

---

## 5. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In **Project Settings → General → Your apps**, add a **Web app** and copy the config values.
3. Copy `.env.local.example` to `.env.local` and paste in your config:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> These are public client keys required by the Firebase JS SDK. Security is enforced by Firestore/Storage rules, not by hiding these values.

---

## 6. Authentication Setup

1. In the Firebase Console, go to **Authentication → Sign-in method** and enable **Email/Password**.
2. Go to **Authentication → Users → Add user** and create your admin account (the email/password you'll use to log into `/admin/login`).
3. There is no public sign-up flow — admin accounts are created manually in the console, which is the intended, secure behavior for a single-owner CMS.

---

## 7. Firestore Setup

1. In the Firebase Console, go to **Firestore Database → Create database** (start in production mode).
2. Deploy the included security rules (see below) so the database matches the app's expectations.
3. Collections are created automatically the first time you save data through the Admin Panel — no manual schema setup needed.

### Collections

| Collection | Purpose |
|---|---|
| `settings/profile` | Name, title, bio, contact info, social links, resume URL, SEO |
| `settings/app` | Portfolio title, publish status, maintenance mode, contact toggle |
| `education` | Degree, institution, dates, grade, description, visible, order |
| `skills` | Name, category, level, visible, order |
| `projects` | Title, slug, description, technologies, images, links, category, featured, visible, order |
| `certifications` | Name, issuer, dates, credential ID/URL, image, visible, order |
| `messages` | Contact form submissions (name, email, subject, message, read) |

---

## 8. Storage Setup

1. In the Firebase Console, go to **Storage → Get started** and create a default bucket.
2. Deploy `storage.rules` (below) to restrict uploads to authenticated admins with type/size validation.
3. Folders (`profile/`, `projects/`, `certifications/`, `resume/`) are created automatically on first upload.

---

## 9. Environment Variables

See `.env.local.example` for the full list. All variables are required for the app to connect to Firebase. Never commit `.env.local` to version control.

---

## 10. Firebase Security Rules

Deploy the rules using the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Firestore and Storage, point to firestore.rules / storage.rules
firebase deploy --only firestore:rules,storage:rules
```

**Firestore rules** (`firestore.rules`): public users can only read `visible: true` documents in content collections; only authenticated admins can create/update/delete; anyone can *submit* a contact message but only admins can read/manage them.

**Storage rules** (`storage.rules`): public read access for portfolio assets; writes require authentication and validate file type/size (5MB images, 10MB PDFs).

---

## 11. Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the Admin Panel.

### Seeding demo data (optional)

```bash
npm run seed
```

This populates Firestore with realistic placeholder content (profile, education, skills, projects, certifications) so the site looks complete right away. Replace or delete this content any time from the Admin Panel — it's clearly just a starting point, not production data.

---

## 12. Production Build

```bash
npm run build
npm start
```

---

## 13. Deployment (Vercel)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel (https://vercel.com/new).
3. Add all six `NEXT_PUBLIC_FIREBASE_*` environment variables in **Project Settings → Environment Variables**.
4. Deploy. Vercel will run `next build` automatically.
5. Make sure your Firebase Authentication **Authorized domains** list includes your Vercel domain (Firebase Console → Authentication → Settings → Authorized domains).

---

## 14. Using the Admin Panel

1. Go to `/admin/login` and sign in with the admin account you created in Firebase Authentication.
2. **Dashboard** — see counts of projects/skills/certifications/education and quick actions.
3. **Profile** — edit your name, title, bio, contact info, social links, photo, and SEO metadata.
4. **Education / Skills / Projects / Certifications** — add, edit, delete, reorder, and toggle visibility. Projects also support a "Featured" toggle.
5. **Messages** — read and manage contact form submissions.
6. **Resume** — upload/replace your resume PDF; it's immediately available on the public `/resume` page and the homepage "Download Resume" button.
7. **Settings** — control the portfolio's published/draft state, maintenance mode, and whether the contact form accepts messages.

Any change made here is reflected on the public site immediately (no rebuild/redeploy required) because the public pages fetch live data from Firestore on every request.

---

## 15. Notes on Architecture Decisions

- **No hard-coded content**: every public page fetches from Firestore server-side (`export const revalidate = 0`) so edits appear immediately.
- **Security is enforced server-side** via Firestore/Storage rules — the admin routes being "hidden" is not what protects the data.
- **Reusable components** (`DataTable`, `FileUploader`, `ConfirmDialog`, `EmptyState`, `ErrorState`) are shared across all CRUD admin pages to keep the codebase small and consistent.
- **Brand icons** (GitHub/LinkedIn/Twitter) are implemented as small inline SVGs since the installed `lucide-react` version does not ship brand icons.
