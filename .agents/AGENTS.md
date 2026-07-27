# Project Guidelines for AI Agents

Welcome to **GefenStarlight**! This file provides project-specific rules, architectural patterns, and execution conventions for AI coding assistants working in this repository.

---

## 🛠️ Tech Stack & Conventions

1. **Framework**: Next.js (App Router, React Server Components).
2. **Language**: TypeScript (`strict: true`).
3. **Styling**: Vanilla CSS (`src/app/globals.css` and CSS modules `*.module.css`). Do NOT use TailwindCSS unless explicitly requested by the user.
4. **Path Aliases**: Always use `@/*` pointing to `./src/*`.

---

## 🎨 Design & Quality Standards

1. **Visual Excellence**: Ensure user interface elements look modern, clean, and premium with smooth transitions, responsive layouts, and rich color palettes.
2. **Component Isolation**: Keep client component state local. Use `'use client'` only on leaf components requiring interactivity or browser APIs.
3. **No Unverified Declarations**: Always run `npm run build` or `npm run dev` verification after making functional changes.

---

## 📜 Development Commands

- Start dev server: `run.bat` or `npm run dev`
- Build production bundle: `npm run build`
- Run linter: `npm run lint`
