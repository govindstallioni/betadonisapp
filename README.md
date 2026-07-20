# BetAdonis

A mobile-first sports betting and casino platform built with Next.js, React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS 4**

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (HTML shell, fonts, metadata)
│   ├── globals.css         # Global styles & Tailwind theme
│   ├── page.tsx            # Home page
│   ├── live/               # Live betting
│   ├── prematch/           # Pre-match betting
│   ├── slots/              # Slot games
│   ├── live-casino/        # Live casino games
│   ├── login/              # Login
│   ├── register/           # Registration
│   ├── history/            # Bet history
│   └── event/              # Event detail
├── components/             # Reusable UI components
public/                     # Static assets (images, icons, logos)
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` trigger automatic deployments.
