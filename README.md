# EduLearn

A project-led learning platform: browse a catalogue of courses, follow career paths, learn in a classroom with progress tracking and notes, pass knowledge checks and earn verifiable certificates.

**Live demo:** https://edulearn-rm.vercel.app
No sign-up needed: choose **Continue with the demo account** on the sign-in page to open a learner account that already has progress, a streak, orders and a certificate.

---

## Highlights

**Experience and motion**
- Editorial design system: paper and ink base, deep forest surfaces, a single lime accent, Fraunces display type with Geist for UI, and a subtle print grain
- Light and dark themes with a circular view-transition wipe, saved per visitor
- Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync
- Two-phase page transitions: a curtain covers the old page, the route changes, then the curtain lifts
- First-visit preloader, masked line reveals (SplitText), a scroll-scrubbed manifesto, a pinned horizontal "how it works" section, Flip-animated filtering, magnetic buttons, a velocity-aware marquee, sticky stacking path cards and a cursor label on interactive cards
- Generated course covers: every course gets a cover from its subject palette and a seeded geometric motif, so the catalogue reads as one printed series
- Respects `prefers-reduced-motion` throughout

**Learning features**
- Catalogue with search, multi-select filters (subject, level, length, rating, price), sorting and grid or list views, all synced to the URL
- Course pages with sticky section navigation and scroll spy, expandable curriculum, free preview lessons, instructor profile, rating distribution and learner reviews
- Classroom with a simulated video player (play, seek, speed, captions), reading and project lessons, graded knowledge checks with explanations, autosaving notes, and keyboard navigation between lessons
- Dashboard with streak, time learned, weekly goal ring, this-week bar chart, a 12-week activity heatmap, continue-learning card, recommendations, wishlist and order history
- Certificates with a unique verification ID, printable or saved as PDF
- Cart with coupon codes (`LEARN20`, `FIRSTCLASS`) and a demo checkout with live card preview, Luhn and expiry validation, plus UPI and PayPal options. No payment is ever processed
- Learning paths, instructor directory and profiles, pricing with monthly and yearly billing, journal articles with reading progress, about and contact pages
- Command palette (`Ctrl K` / `Cmd K`) that searches courses, paths, instructors, articles and pages
- Profile settings: avatar upload with in-browser cropping and compression, name and headline, password change, theme, weekly goal and email preferences

**Full stack**
- JWT authentication with signup and login
- Learning progress, notes and purchases sync to MongoDB for signed-in accounts, and fall back to local storage when offline or in demo mode

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, React Router 8, Vite 8, Tailwind CSS 4 |
| Motion | GSAP 3 (ScrollTrigger, SplitText, Flip), @gsap/react, Lenis |
| UI | lucide-react, react-easy-crop, Fontsource (Fraunces, Geist, Geist Mono) |
| Backend | Node.js, Express 5, Mongoose 9, JSON Web Tokens, bcryptjs |
| Hosting | Vercel (frontend and backend as separate projects) |

---

## Getting started

Requires Node.js 22.12 or newer.

### Backend

```sh
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```sh
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev
```

The frontend also runs without a backend. Leave `VITE_API_URL` empty and use the demo account.

---

## Environment variables

**Backend**
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign tokens
- `PORT`: optional, defaults to 5000
- `CLIENT_ORIGINS`: comma-separated list of allowed frontend origins, defaults to the production site and `http://localhost:5173`

**Frontend**
- `VITE_API_URL`: base URL of the API, without a trailing slash

---

## API

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Sign in and receive a token |
| GET | `/api/profile` | Current profile |
| PUT | `/api/profile` | Update name and headline |
| PUT | `/api/profile/image` | Update avatar |
| PUT | `/api/profile/password` | Change password |
| POST | `/api/profile/purchase` | Record purchased course ids |
| GET / PUT | `/api/profile/learning` | Read or save learning progress |
| GET | `/api/health` | Health check |

---

## Deployment

- Deploy `frontend/` and `backend/` as separate Vercel projects.
- `frontend/vercel.json` rewrites every route to `index.html`, so deep links such as `/courses/modern-react-nextjs` load directly.
- The backend exports the Express app for Vercel's Node runtime and reuses one MongoDB connection across invocations.

---

## Project structure

```
backend/
  index.js            Express app, CORS, connection handling
  models/User.js
  routes/             auth and profile routes
frontend/
  src/
    components/       layout, ui, course, home, dashboard, auth
    context/          auth, learning, theme, toast providers
    data/             courses, instructors, paths, quizzes, articles
    hooks/            scroll reveal, page title, context hooks
    lib/              gsap setup, api client, pricing, formatting
    pages/            one file per route
    styles/index.css  design tokens and utilities
```

---

## Credits

Photography from [Unsplash](https://unsplash.com). Course covers are generated in code.

Designed and built by Md Rizwan Molla: [X](https://x.com/MdRizwanMolla), [LinkedIn](https://www.linkedin.com/in/rizwan-molla/).

Licensed under the MIT License.
