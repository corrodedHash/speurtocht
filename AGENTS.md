# Project Conventions

## Package Manager
- Use **pnpm** for all package management
- Do NOT use npm or yarn

## Commands
- `pnpm dev` – start dev server
- `pnpm build` – build for production
- `pnpm lint` – run eslint
- `pnpm db:generate` – generate Drizzle migrations
- `pnpm db:migrate` – run Drizzle migrations
- `pnpm db:seed` – seed station data
- `pnpm db:studio` – open Drizzle Studio

## Database
- Run `bash tools/ensure-db.sh` to start a local PostgreSQL in Docker before running migrations or the dev server
- The `.env` expects `DATABASE_URL=postgres://user:password@localhost:5432/schnitzeljagd` (matches the Docker container from ensure-db.sh)

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- PostgreSQL + Drizzle ORM
- shadcn/ui components
- Hosting: VPS

## shadcn/ui
- Components are added via `pnpm dlx shadcn@latest add <component>` (use `pnpm dlx`, not `npx`)
- Already initialized with: defaults (Neutral style, CSS variables, Tailwind v4)

## Code Style
- No comments in production code unless required by an external API
- Use Tailwind v4 syntax (`@theme inline`, no `@apply`)
- All text/UI in German (app is for a German wedding retreat)
- eslint config is in eslint.config.mjs

## Release

- Release workflow is configured via release-please
- Push conventional commits (`feat:`, `fix:`, etc.) to `main` – release-please creates/updates a Release PR
- Merge the Release PR → release-please tags the release and creates a GitHub Release
- No build artifacts are uploaded (app is deployed separately from the VPS)
