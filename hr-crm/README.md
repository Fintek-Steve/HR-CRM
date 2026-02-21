# PeopleOS — HR CRM & Database

A modern HR management platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Settings Module (Complete)
- **Departments & Sub-Departments** — Expandable hierarchy, add/remove inline
- **Positions** — Cascading dept → sub-dept dropdowns
- **Ranks** — Career levels with color coding
- **Branches** — Auto UTC timezone detection from country
- **Compensation Structure** — Assignable per position, rank, or all employees
- **KPI Structure** — Assignable per position, rank, or all employees
- **Accounts per Employee** — Required/auto-provision toggles

### Employee Module (Complete)
- Searchable employee directory with department filters
- Employee detail pages with:
  - Overview (personal + employment info)
  - Compensation (filtered by employee's position/rank)
  - KPIs (filtered by employee's position/rank, with progress bars)
  - Accounts (provisioning status)
  - Documents & Notes (placeholder)

### Dashboard
- Stats cards with trend indicators
- Pending leave requests with approve/decline

## Deploy to Vercel

### Option 1: GitHub + Vercel (Recommended)
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click "Deploy"
5. Done! Your app is live.

### Option 2: Vercel CLI
```bash
npm install -g vercel
cd hr-crm
npm install
vercel
```

### Option 3: Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → "New site from Git"
3. Build command: `npm run build`
4. Publish directory: `.next`
5. (You may need the `@netlify/plugin-nextjs` plugin)

## Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)

## Project Structure
```
hr-crm/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/shared.tsx          # Reusable UI primitives
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── settings/
│   │   └── SettingsPage.tsx   # Full settings module
│   ├── employees/
│   │   ├── EmployeesPage.tsx  # Employee directory
│   │   └── EmployeeDetail.tsx # Employee profile
│   ├── DashboardPage.tsx
│   └── PlaceholderPage.tsx
├── lib/
│   └── data.ts                # Types, constants, initial data
└── package.json
```
