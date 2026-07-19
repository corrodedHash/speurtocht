# TASKS – Schnitzeljagd Implementation

## Dependency Graph & Parallel Workstreams

```
Phase 1 (Infrastructure)
 │
 ├──────────────────┬──────────────────┬──────────────────┐
 ▼                  ▼                  ▼                  ▼
2.1 POST /api/   3.1 GET /api/   4.1-4.2 Photo       5.1 Admin
groups            stations/[token] APIs                Login
 │                  │                                   │
 ├── 2.2 Join API   │                                   ▼
 │    │              ├── 3.2 Unlock API ──┐          5.2 Guard
 │    ▼              │    │               │             │
 │  2.7 Join UI      │    ├── 3.3 Check   │             ▼
 │                   │    │    Final      │     5.3-5.8 Admin APIs
 ├── 2.3 GET group   │    │               │             │
 │    │              ▼    ▼               │             ▼
 │    ├── 2.4 Status ▼                    │     5.9-5.11 Admin UI
 │    │             3.4 Station Page      │
 │    ▼                 │                 │
 │  2.5 Start Page     │                 │
 │    │                 │                 │
 │    └── 2.6 Dashboard├── 3.5 Final notif│
 │         │           │                 │
 │         ├───────────┴── 4.3 Upload UI │
 │         └── 4.4 Gallery ──────────────┘
 │                    │
 └────────────────────┴───────── Phase 6 (Polish)
                                         │
                                  Phase 7 (Admin Enh.)
                                         │
                                  Phase 8 (Pre-Event)
```

### Parallel workstreams

After Phase 1, these four workstreams can run **fully in parallel**:

| Workstream | Tasks | No dependency on |
|---|---|---|
| **A – Stations API** | 3.1 (resolve token) | B, C, D |
| **B – Group API** | 2.1 (create), 2.3 (get), 2.4 (status) | A, C, D |
| **C – Photo API** | 4.1 (upload), 4.2 (list) | A, B, D |
| **D – Admin Login** | 5.1, 5.2 | A, B, C |

Subsequent dependencies:
- 2.2 (join API) + 2.7 (join UI) ← after 2.1
- 2.5 (start page) ← after 2.3
- 2.6 (dashboard) ← after 2.3, 2.4
- 3.2 (unlock API) ← after 2.x group exists + 3.1 stations exist
- 3.3 (check-final) ← after 3.2
- 3.4 (station page) ← after 3.1, 3.2, 2.x
- 3.5 (final notif) ← after 2.6, 3.3
- 4.3 (upload UI) ← after 3.4, 4.1
- 4.4 (gallery) ← after 2.6, 4.2
- 5.3-5.8 (admin APIs) ← after A, B, C mostly done
- 5.9-5.11 (admin UI) ← after 5.3-5.8
- Phase 6 (polish) ← after most of 2-5 complete

---

## Phase 0: Foundation (DONE)

- [x] Next.js App Router project scaffolded
- [x] PostgreSQL + Drizzle ORM configured
- [x] DB schema: `groups`, `stations`, `group_stations`, `group_members`, `photos`
- [x] Seed script for 4 stations + 1 final station
- [x] Tailwind CSS configured
- [x] Basic pages: Home, Station, Admin, 404
- [x] Stub API routes: groups, stations, photos, admin

---

## Phase 1: Infrastructure & Tooling

- [x] **1.1 Install shadcn/ui** – added via `pnpm dlx shadcn@latest`; installed: button, card, input, dialog, sonner, table, label, textarea, badge, select, sheet
- [x] **1.2 Setup env variables** – ensure `DATABASE_URL` and `ADMIN_SECRET` are documented in `.env.example`
- [x] **1.3 Add DB migration workflow** – created `tools/ensure-db.sh` (Docker-based PostgreSQL), ran `drizzle-kit generate` and `drizzle-kit migrate`

---

## Phase 2: Group System (Create & Join)

### API
- [ ] **2.1 `POST /api/groups`** – create a new group (body: `{ name }`); returns group with ID. Generate a shareable join-token for the group leader.
- [ ] **2.2 `POST /api/groups/join`** – join an existing group via share-token (body: `{ shareToken, memberName }`)
- [ ] **2.3 `GET /api/groups/[id]`** – fetch group details (members, unlocked stations, finish status)
- [ ] **2.4 `GET /api/groups/[id]/status`** – return progress: list of unlocked stations, whether final is revealed, finish time

### Frontend
- [ ] **2.5 Start page (QR scan landing)** – `GET /?groupId=<id>` or a dedicated `/start` page that creates the group on first visit, stores `groupId` in localStorage, and shows the group's dashboard
- [ ] **2.6 Group dashboard** – shows group name, member count, share-link (copy button + QR code), list of unlocked stations, and a "Scan QR" button that opens the device camera or file picker
- [ ] **2.7 Join flow** – a lightweight page at `/join?token=<shareToken>` where a member enters their name and joins the group

---

## Phase 3: Station Scanning & Unlocking

### API
- [ ] **3.1 `GET /api/stations/[token]`** – resolve a station token to station data (name, hint, isFinal). Return 404 for unknown tokens.
- [ ] **3.2 `POST /api/stations/[token]/unlock`** – unlock a station for a group (body: `{ groupId }`). Validate:
      - station exists
      - group exists
      - station not already unlocked by this group
      - On success: insert into `group_stations`, return station info
- [ ] **3.3 `GET /api/stations/[token]/check-final`** – after unlocking, check if group now has all 4 non-final stations unlocked. If yes, return the final station's hint (but do NOT auto-unlock final — let them scan it physically)

### Frontend
- [ ] **3.4 Station page** – `GET /station/[token]`:
      - If no group in localStorage → redirect to start
      - If token is unknown → show 404 / "ungültiger QR-Code"
      - Show station name and the hint text
      - Show an "Hier bin ich!" button that calls the unlock API
      - After unlock: show success animation, station name, and hint (the actual location description from the DB)
      - If already unlocked: show "Bereits gefunden ✓"
- [ ] **3.5 Final station unlock notification** – after unlocking the 4th non-final station, show a banner/modal on the group dashboard with the final hint

---

## Phase 4: Photo Upload

### API
- [ ] **4.1 `POST /api/photos`** – upload a photo (multipart: file, groupId, stationId). Store file (filesystem under `public/uploads/` or cloud storage). Save URL in DB.
- [ ] **4.2 `GET /api/photos?groupId=...`** – list photos for a group (or for admin: `?all=true`)

### Frontend
- [ ] **4.3 Photo upload on station page** – after unlocking a station, show a file input to upload a photo for that station
- [ ] **4.4 Group gallery** – on the group dashboard, show a thumbnail gallery of all uploaded photos

---

## Phase 5: Admin Panel

### Auth
- [ ] **5.1 Admin login page** – simple password form (`/admin/login`). On success, store session token in localStorage/cookie. Compare against `ADMIN_SECRET` env var.
- [ ] **5.2 Admin middleware / guard** – protect admin routes; redirect to login if not authenticated

### API
- [ ] **5.3 `GET /api/admin/groups`** – list all groups with progress (number of stations unlocked, finish status, member count)
- [ ] **5.4 `POST /api/admin/groups/[id]/reset`** – reset a group's progress (delete group_stations entries, reset finishedAt)
- [ ] **5.5 `POST /api/admin/groups/[id]/unlock-station`** – manually unlock a station for a group
- [ ] **5.6 `GET /api/admin/photos`** – list all photos across all groups
- [ ] **5.7 `POST /api/admin/groups/[id]/add-member`** – add a member to a group
- [ ] **5.8 `POST /api/admin/groups/[id]/remove-member`** – remove a member from a group

### Frontend
- [ ] **5.9 Admin overview page** – `/admin`:
      - Table of all groups with columns: name, members, stations found, finished, actions
      - Click on a group to expand details
- [ ] **5.10 Admin group detail view** – see group members, unlocked stations, uploaded photos. Buttons for: reset progress, manually unlock station, add/remove member
- [ ] **5.11 Admin photo gallery** – `/admin/photos` – grid of all uploaded photos with group + station labels

---

## Phase 6: Game Logic & Flow Polish

- [ ] **6.1 Starting station assignment** – seed script already creates stations. Admin assigns each group a `startStationId` (via admin panel or during group creation). The group dashboard should highlight "Eure erste Station: …"
- [ ] **6.2 Group finish** – when a group scans the final station token, set `groups.finishedAt`. Show a "Geschafft! 🎉" screen on the group dashboard.
- [ ] **6.3 Prevent double-finish** – once `finishedAt` is set, ignore further final-station scans for that group.
- [ ] **6.4 Error handling & UX** – proper toast/alert for: invalid token, already unlocked, station not found, network errors
- [ ] **6.5 Responsive design** – ensure all pages work well on mobile (QR scanning is a mobile-first use case)

---

## Phase 7: Admin Enhancements

- [ ] **7.1 Live status polling** – admin overview auto-refreshes every 5s (or use SSE for live updates)
- [ ] **7.2 Admin hint override** – ability to manually push a custom hint to a group (store in a new `custom_hint` field on `group_stations` or a separate table)
- [ ] **7.3 Bulk station creation** – admin form to create/edit stations (name, hint, isFinal) and generate tokens
- [ ] **7.4 Export results** – download CSV with group name, finish time, number of photos

---

## Phase 8: Pre-Event Preparation

- [ ] **8.1 Run seed script** – generate station tokens for the real retreat
- [ ] **8.2 Print QR codes** – script or tool to generate QR code images for each station token URL
- [ ] **8.3 Create hint slips** – print hint texts for each station (to place at locations)
- [ ] **8.4 Test full flow** – end-to-end walkthrough: create group → scan stations → upload photos → finish → admin view
- [ ] **8.5 Deploy to VPS** – build + start Next.js on the VPS with proper env vars
- [ ] **8.6 Final smoke test** – from a mobile device on the venue's network
