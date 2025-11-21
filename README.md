# Frontend — Hushh (React + Vite)

Purpose: UI for managing customers, segments, campaigns and generating AI messages.

## Requirements
- Node.js >= 18

## Install
```bash
cd frontend
npm install
```

## Environment (.env)
VITE_API_BASE_URL=http://localhost:8000

## Run (development)
```bash
npm run dev
# opens on http://localhost:5173
```

## Build & deploy
```bash
npm run build
# deploy `dist/` to Vercel, Netlify, or static host
```

## Features
- Authentication (token stored in localStorage)
- ProtectedRoute for authenticated pages
- Context API for auth state
- TailwindCSS for styling
- AI message generator UI

## Structure
- src/components — reusable UI components
- src/pages — route pages
- src/context — AuthProvider
- src/config — api helpers
- src/main.jsx & src/App.jsx — app entry

## Notes
- Keep sensitive keys out of client code
- Use VITE_API_BASE_URL to point to backend
```// filepath: c:\Users\komal\OneDrive\Desktop\Hushh\frontend\README.md
# Frontend — Hushh (React + Vite)

Purpose: UI for managing customers, segments, campaigns and generating AI messages.

## Requirements
- Node.js >= 18

## Install
```bash
cd frontend
npm install
```

## Environment (.env)
VITE_API_BASE_URL=http://localhost:8000

## Run (development)
```bash
npm run dev
# opens on http://localhost:5173
```

## Build & deploy
```bash
npm run build
# deploy `dist/` to Vercel, Netlify, or static host
```

##