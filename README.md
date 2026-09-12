# Ramayana App — Hanumān Journey MVP v1

A responsive Next.js experience following Hanumān’s 15-node journey to Laṅkā through an illustrated atlas, sourced encounters, challenges, character discoveries, relationships, and geographic confidence levels.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS 4 with SCSS
- shadcn-style reusable UI components
- Direct MariaDB/MySQL access through `mysql2`
- Secure cookie sessions and bcrypt password hashing

No ORM is used.

## Local setup

1. Install packages with `pnpm install`.
2. Copy `.env.example` to `.env.local` and set `MARIADB_URL`.
3. Create the database named in that connection URL and grant the application user access.
4. Start the app with `pnpm dev`.

The application creates its three tables automatically on the first account request. The same definition is available in `database/schema.sql` for teams that prefer applying SQL explicitly.

Guest mode requires no database. Progress is stored in the browser. When a guest creates an account, that local progress is migrated into MariaDB and subsequently synchronized across devices.

## Useful checks

- `pnpm lint`
- `pnpm build`
- `pnpm db:check` after exporting `MARIADB_URL`

## V1 routes

- `/` — entry experience
- `/journey/hanuman` — interactive atlas
- `/journey/hanuman/[node]` — 15 encounter screens
- `/journey` — progress record
- `/characters` — unlockable collection
- `/connections` — relationship discoveries

## Persistence model

- `user_profiles` stores the registered profile and password hash.
- `user_sessions` stores only a SHA-256 hash of the opaque browser session token.
- `journey_progress` stores the current node, completed encounters, challenge answers, character and relationship unlocks, achievements, and difficulty.

Production deployments should use TLS for the database connection, a dedicated least-privilege database user, scheduled backups, and secure HTTPS hosting.

## Implementation update

The editable app now lives in `Ramayana Webapp/` inside the managed ChatGPT workspace. Synced references remain outside this app folder.

Implemented: 15 sequential encounters; six-stage HJ-12 ordering activity; Explorer, Seeker and Scholar challenges (45 total); replay-safe unlocks; nine achievements; five region thresholds; 27 character records and detail routes; 22 typed relationship edges with graph and type filter; four atlas layers; Why Here panels; A–E confidence and display-type records; responsive SCSS modules and shared UI primitives.

`pnpm test` checks progression, invalid answers, direct-jump rejection, replay, persistence normalization, legacy saves, all challenge levels, and character/graph integrity. `pnpm lint` and `pnpm build` validate source and production routes.

### Known limits

- Guest mode works without infrastructure. Account routes and MariaDB schema exist, but cross-device storage requires a configured `MARIADB_URL`; no live database was available during this validation.
- The referenced planning conversation was recovered. Its downloadable content-pack and source-edition attachments were not present in `sources/`. Edition-specific page/verse locators are explicitly pending in the comparison UI. Current narratives are short planning-based paraphrases, not a completed textual audit.
- Character cards use icon treatments, not individual commissioned portraits.
- The server requires a Node-compatible host for the existing MySQL driver. It has not been published to Sites because that runtime does not support the existing raw-TCP database architecture.
