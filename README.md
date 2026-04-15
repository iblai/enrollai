<div align="center">

<a href="https://ibl.ai"><img src="https://ibl.ai/images/iblai-logo.png" alt="ibl.ai" width="300"></a>

# EnrollAI

AI-powered admissions enrollment for universities. Guide students through applications with a friendly chat assistant.

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Claude Code](https://img.shields.io/badge/Claude_Code-CC785C?logoColor=white)](https://claude.ai)

</div>

---

## What is EnrollAI

EnrollAI is an AI-powered admissions app built on the [ibl.ai](https://ibl.ai) platform. It guides university applicants through a conversational enrollment process — collecting documents, personal statements, CVs, and qualifications — with minimal human intervention. Designed for students with low digital literacy, it prioritises simplicity, large touch targets, and plain language.

| Feature | Description |
|---------|-------------|
| **Chat-Based Application** | AI assistant guides students step by step through the admissions process |
| **Document Uploads** | Collect photo IDs, qualification certificates, CVs via camera or file picker |
| **Progress Tracking** | Visual stepper showing completion status, synced to server |
| **Personal Statement Help** | AI helps students draft their personal statement through conversation |
| **Application Management** | View status, continue where you left off, or cancel and restart |
| **SSO Authentication** | Login via iblai.app — no tokens to manage |
| **Notifications** | Bell icon with unread badge across all views |

## AGENTS.md / CLAUDE.md

Please refer to the `CLAUDE.md` at the repository root for more information.

## Quick Start

### Prerequisites

- Node.js 18+
- [iblai CLI](https://github.com/iblai/iblai-app-cli) (`pip install iblai-app-cli` or `npm install -g @iblai/cli`)
- An `iblai.env` with your platform configuration ([template](https://raw.githubusercontent.com/iblai/vibe/refs/heads/main/iblai.env))
- An AI agent/mentor ID from [mentorai.iblai.app](https://mentorai.iblai.app)

### Install & Run

```bash
pnpm install
cp .env.example .env.local
cp iblai.env.example iblai.env
pnpm dev
```

After copying the env files, update them with your platform credentials:

- **`iblai.env`**: Set `PLATFORM` to your platform key and `TOKEN` to your platform API token
- **`.env.local`**: Set `NEXT_PUBLIC_MAIN_TENANT_KEY` to your platform key, `IBLAI_API_KEY` to your platform API token, and `NEXT_PUBLIC_DEFAULT_AGENT_ID` to your AI agent UUID

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to [iblai.app](https://iblai.app) for login.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── (app)/                     # Main app (navbar + footer)
│   │   ├── page.tsx               # Home with apply/continue CTA
│   │   ├── profile/               # User profile page
│   │   ├── account/               # Organization settings
│   │   ├── applications/          # Application status dashboard
│   │   └── documents/             # Document upload page
│   ├── (admissions)/              # Full-screen admissions flow (no navbar)
│   │   ├── layout.tsx             # Minimal layout with providers
│   │   └── apply/                 # Welcome screen → chat interface
│   └── (auth)/sso-login-complete/ # SSO callback
├── components/
│   ├── admissions/                # Chat interface, progress tracker, uploads
│   ├── iblai/                     # SDK wrappers (chat widget, profile, notifications)
│   └── ui/                        # shadcn/ui primitives
├── config/
│   └── admissions-config.ts       # Steps, requirements, document types
├── hooks/
│   ├── use-admissions-chat.ts     # Chat hook wrapping useAdvancedChat
│   ├── use-application-progress.ts # Progress state with server sync
│   └── use-file-upload.ts         # File upload pipeline
├── services/
│   ├── mentor-metadata-api.ts     # RTK Query for progress persistence
│   └── career-api.ts              # RTK Query for career/resume data
└── lib/iblai/                     # SDK config, tenant resolution
```

## Built With

- [Next.js](https://nextjs.org) — App Router, React Server Components
- [@iblai/iblai-js](https://www.npmjs.com/package/@iblai/iblai-js) — SDK for auth, UI components, and data
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling with ibl.ai design tokens
- [shadcn/ui](https://ui.shadcn.com) — accessible UI primitives
- [iblai.app](https://iblai.app) — production backend for auth, AI agents, and analytics

## Contributing

### Setup

1. Fork the repo and clone it
2. Install dependencies: `pnpm install`
3. Copy environment files: `cp .env.example .env.local && cp iblai.env.example iblai.env`
4. Fill in your `iblai.env` with your platform credentials
5. Set your agent ID in `.env.local`: `NEXT_PUBLIC_DEFAULT_AGENT_ID=<uuid>`
6. Start the dev server: `pnpm dev`

### Installing the iblai CLI

**From PyPI or npm (stable):**

This will be available soon

**From source (latest):**
Enter a virtualenv first.
And then run the following commands:
```bash
git clone https://github.com/iblai/iblai-app-cli.git
cd iblai-app-cli/
make -C .iblai install-dev
```

### Development Workflow

1. Create a branch from `main`: `git checkout -b feat/my-feature`
2. Make your changes
3. Run `pnpm build` to verify the build passes
4. Run `pnpm test` to verify tests pass
5. Commit and push your branch
6. Open a pull request against `main`

### Guidelines

- **Use ibl.ai SDK components first** — do not build custom components when an SDK equivalent exists
- **Use shadcn/ui for custom UI** — install via `npx shadcn@latest add <component>`, not raw HTML or third-party libraries
- **Do not override SDK styles** — SDK components ship with their own styling
- **Use SDK design tokens** — reference CSS variables like `var(--primary-color)`, `var(--border-color)`, `var(--text-secondary)` instead of hardcoded colors
- **Wrap SDK components in a white container** — use `bg-white rounded-lg border border-[var(--border-color)] overflow-hidden` so they render correctly on the gray page background
- **Responsive width** — use `w-full px-4` on mobile, `md:w-[75vw] md:px-0` on desktop
- **Use `pnpm`** as the package manager
- **Do not edit `.env.local` for platform config** — update `iblai.env` and re-run a CLI command

### Adding Features

Use the iblai CLI and Claude Code skills to add new features:

```bash
iblai add auth           # SSO authentication (required first)
iblai add chat           # AI chat widget
iblai add profile        # User profile
iblai add account        # Account/org settings
iblai add notification   # Notification bell
```

See `CLAUDE.md` for the full list of skills and component priority rules.

## Resources

- [ibl.ai Documentation](https://docs.ibl.ai)
- [iblai-app-cli](https://github.com/iblai/iblai-app-cli) — CLI for scaffolding ibl.ai apps
- [@iblai/mcp](https://www.npmjs.com/package/@iblai/mcp) — MCP server for AI-assisted development
- [Vibe](https://github.com/iblai/vibe) — developer toolkit for building with ibl.ai
