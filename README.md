# VEXDYN LAB

**LEARN. PRACTICE. MASTER.**

Turn what you learned into real skill.

A premium, standalone technical practice platform for the VEXDYN ecosystem.

## Features (V1)

- Electric Violet visual identity
- Responsive mobile-first design
- Home dashboard with Continue Practice, Course Practice, Challenge Discovery
- Practice library with search + filters (course, difficulty, type, status)
- Full challenge experience:
  - Code Challenge, Fix the Code, Predict the Output, Complete the Code, Multiple Choice, Mini Task, Debugging
  - Lightweight code editor with line numbers
  - Local evaluation engine
  - Progressive hints
  - Success / failure feedback
  - Retry, Reset, Next Challenge
- Progress tracking (course progress, difficulty breakdown, recent activity, streak foundation)
- Profile with local statistics
- Local persistence (localStorage) with clean abstraction for future backend

## Tech Stack

- React 19 + TypeScript
- Vite 6
- React Router 7
- Tailwind CSS 4
- Local state + localStorage (backend-ready architecture)

## Getting Started

```bash
cd vexdyn-lab
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
src/
  components/     # Layout, Nav, CodeEditor, Icons
  data/           # courses + challenges (45 challenges)
  hooks/          # useLabProgress (single source of truth)
  lib/            # storage abstraction + evaluator
  pages/          # Entry, Home, Practice, Challenge, Progress, Profile
  types/          # Shared TypeScript types
```

## Architecture Notes

- UI → Lab State / Data Layer → Local Storage
- Future: UI → Lab State → VEXDYN API → Database
- Evaluation is abstracted (`lib/evaluator.ts`) so a secure backend evaluator can replace the V1 local implementation without UI changes.

## Scope Boundaries

This is **VEXDYN Lab** (Practice), not:

- VEXDYN Forge (Create)
- Full IDE / file explorer / terminal / Git / deployment
- AI tutor or code generation
- Authentication / cloud sync (V1 is local only)

## Challenge Count

- HTML: 9
- CSS: 9
- JavaScript: 18
- React: 9
- **Total: 45**
