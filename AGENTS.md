# AGENT MEMORY
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.


This project is built on the ibl.ai platform using the `@iblai/iblai-js` SDK.

## Component Priority

When adding UI features, follow this priority order:

1. **ibl.ai components** (`@iblai/iblai-js`) -- always use these first
2. **shadcn/ui** (`npx shadcn@latest add`) -- for everything else
3. **Custom/third-party** -- only when no ibl.ai or shadcn component exists

### When the user asks to add...

| Feature | Use this | NOT this |
|---------|----------|----------|
| Profile page / dropdown | `/iblai-profile` skill + `Profile`, `UserProfileDropdown` from SDK | Custom profile form |
| Account / org settings | `/iblai-account` skill + `Account` from SDK | Custom settings page |
| Analytics dashboard | `/iblai-analytics` skill + `AnalyticsOverview`, `AnalyticsLayout` from SDK | Chart library from scratch |
| Notifications | `/iblai-notification` skill + `NotificationDropdown` from SDK | Custom notification system |
| Chat / AI assistant | `/iblai-chat` skill + `<mentor-ai>` web component | Custom chat UI |
| Auth / login | `/iblai-auth` skill + `AuthProvider`, `SsoLogin` from SDK | Custom auth flow |
| Invite users | `/iblai-invite` skill + `InviteUserDialog` from SDK | Custom invite form |
| Workflow builder | `/iblai-workflow` skill + workflow components from SDK | Custom node editor |
| Onboarding flow | `/iblai-onboard` skill | Custom onboarding from scratch |
| Buttons, forms, modals, tables | shadcn/ui (`npx shadcn@latest add button dialog table`) | Raw HTML or other UI libraries |
| Page sections / blocks | shadcn/ui blocks (`npx shadcn@latest add @shadcn-space/hero-01`) | Custom layout from scratch |

### Key rule

Do NOT build custom components when an ibl.ai SDK component exists.
Do NOT use raw HTML or third-party UI libraries when shadcn/ui has an equivalent.
ibl.ai and shadcn share the same Tailwind theme -- they render in brand colors automatically.

## SDK Imports

```typescript
// Data layer
import { initializeDataLayer, mentorReducer } from "@iblai/iblai-js/data-layer";

// Auth & utilities
import { AuthProvider, TenantProvider, useChatV2 } from "@iblai/iblai-js/web-utils";

// Framework-agnostic components
import { Profile, AnalyticsLayout, NotificationDropdown } from "@iblai/iblai-js/web-containers";

// Next.js-specific components
import { SsoLogin, UserProfileDropdown, Account } from "@iblai/iblai-js/web-containers/next";
```

## Adding Features

Use skills to add features. Each skill runs the CLI generator and guides
you through the remaining manual steps:

```
/iblai-auth          # SSO authentication (run first)
/iblai-chat          # AI chat widget
/iblai-profile       # Profile dropdown + settings page
/iblai-account       # Account/org settings page
/iblai-analytics     # Analytics dashboard
/iblai-notification  # Notification bell
/iblai-invite        # User invitation dialogs
/iblai-workflow      # Workflow builder
/iblai-onboard       # Onboarding questionnaire flow
/iblai-build         # Desktop/mobile builds (Tauri v2)
/iblai-test          # Test before showing work
/iblai-component     # Browse all available components
```

All features require auth first (`/iblai-auth` or `iblai add auth`).

## Environment

Platform configuration lives in `iblai.env` (3 vars: `DOMAIN`, `PLATFORM`,
`TOKEN`). The CLI derives all `NEXT_PUBLIC_*` env vars into `.env.local`
automatically. Do NOT edit `.env.local` directly for platform config --
update `iblai.env` and re-run a CLI command.

### First-time setup

When copying env example files (`cp .env.example .env.local` and
`cp iblai.env.example iblai.env`), you MUST ask the user for their
platform key and whether they have a platform API token ONLY IF the current values in the existing env files are not placeholder values, then
update the files accordingly:

- **`iblai.env`**: Set `PLATFORM` to the user's platform key. Set `TOKEN`
  to their API token (if provided).
- **`.env.local`**: Set `NEXT_PUBLIC_MAIN_TENANT_KEY` to the user's platform
  key. Set `IBLAI_API_KEY` to their API token (if provided).

You should leave placeholder values `your-platform-token` for the token or
`your-platform` for the platform in the env files if the user doesn't provide a platform key / a token, and give the user the option not to provide one.

## Admissions Flow

This app's core feature is an AI-guided admissions chat. Key architecture:

- **Config-driven**: `src/config/admissions-config.ts` defines steps, requirements, and document types. Change this file to adjust the enrollment process.
- **Progress persistence**: localStorage as fast cache + debounced sync to ibl.ai mentor metadata API. Merge strategy picks the more-advanced progress.
- **Route groups**: `(app)` for main navbar pages, `(admissions)` for full-screen chat experience without navbar.
- **`<mentor-ai>` widget**: iframe-based chat — cannot render inline UI. Document uploads use a separate MediaBox component.

## Brand

- **Primary**: `#0058cc`, **Gradient**: `linear-gradient(135deg, #00b0ef, #0058cc)`
- **Style**: shadcn/ui new-york variant, system sans-serif, Lucide icons
- SDK components ship with their own styles -- do NOT override them

## Layout Patterns

- **Page background**: `var(--sidebar-bg, #fafbfc)`
- **SDK wrappers**: Wrap SDK components in `bg-white rounded-lg border border-[var(--border-color)] overflow-hidden`
- **Responsive width**: `w-full px-4` mobile, `md:w-[75vw] md:px-0` desktop
- **Package manager**: Use `pnpm` (fall back to `npm`)

## Commands

```bash
pnpm dev             # Dev server
pnpm build           # Production build
iblai config show    # View configuration
iblai add <feature>  # Add a feature
```
