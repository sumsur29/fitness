# Plan

Personal reference + light tracking for diet & workout plan. Phone-first, dark, editorial.

## Stack
Vite + React + Tailwind. localStorage for follow-state. Zero backend.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. On vercel.com → New Project → import the repo.
3. Framework preset: **Vite** (auto-detected). Leave everything else default.
4. Deploy.

That's it. No env vars, no DB.

## Structure
- `src/App.jsx` — entire app, single file
- `src/index.css` — Tailwind + Fraunces/Inter font import
- Data (meals, workouts) is hardcoded inline at the top of `App.jsx` — edit there to tweak

## Storage
Everything lives in localStorage under key `plan-app-v1`:
```json
{ "followed": { "2026-05-25": true } }
```

To wipe: open devtools → Application → Local Storage → delete the key.
