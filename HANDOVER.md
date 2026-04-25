# MakeShift — Developer Handover

> Auto-updated after each commit. Read this first when picking up the project.
> Last updated: 2026-04-25 (latest: pending commit)

---

## Project Overview

MakeShift is a Laravel + Inertia.js (React) space booking platform for a co-working/event venue business in the Philippines (PHP, Asia/Manila timezone). It has a public-facing website for customer inquiries and an admin panel for staff to manage bookings, payments, rooms, and settings.

**Stack:** Laravel (PHP), Inertia.js, React, TypeScript, Tailwind CSS, MySQL
**Local dev:** XAMPP at `/Applications/XAMPP/xamppfiles/htdocs/MakeShift`
**Admin login:** `/auth-access` (hidden from public)

---

## Current Branch

**Branch:** `master` — up to date with `origin/master`

---

## Recent Work (Last 20 Commits)

| Commit | Summary |
|--------|---------|
| *(pending)* | Bookings: filters now work in calendar view; filters reset when switching between calendar and table views |
| `c6d6ccd` | Mail logs: added Export Emails (CSV, unique emails only) and group-by subject toggle |
| `07e37b3` | Logo: removed site title/description text, logo now scales by max-height (40px) for wide logos |
| `6c9323c` | Overrides page: added table/calendar toggle, pagination, and filters (status, date, note) |
| `a7f5438` | Added BCC mailing config setting; new Settings > Email > Mailing Configuration page; BCC applied to all 5 mail classes |
| `6128b6c` | Fixed stale cache bug — `rememberForever` replaced with 1hr TTL in `EmailSettings` and `WebsiteSettings` |
| `2914f7c` | Added GUIDE.md, GUIDE.pdf, HANDOVER.md, CLAUDE.md, and Claude Code settings with auto-update hooks |
| `3ce76eb` | Added striped rows in home page desktop view |
| `851e6a7` / `d2e65b8` | Fixed logo/favicon not uploading (two attempts) |
| `31ff47e` | Untracked logo and favicon from git |
| `c8823b5` | Fixed DB backup SQL generation method |
| `14ac3d6` / `f833e18` | CRON test runs (per-minute) |
| `06507fc` | Updated CRON to daily schedule |
| `c038295` | Added external API endpoint for CRON triggers (`/cron/run/{token}`) |
| `7a8923a` | Added logo to `.gitignore` |
| `91cb9b8` | Added audit logs feature |
| `536e4ab` | Added auto DB backup feature |
| `1ad6440` | Email settings (configurable email template content) |
| `52cb440` / `1a7d2e5` | Bug: booking error when room's property is deleted; favicon format validation fix |
| `0e0daf0` | Hid admin login page from public exposure |
| `2ab7692` | Users list, bookings list, last login on users page and dashboard widgets |

---

## Untracked / Uncommitted Files

These files exist locally but are not yet committed:

| File | Notes |
|------|-------|
| `.claude/` | Claude Code config directory (settings, hooks) |
| `CLAUDE.md` | Claude instructions for this project |
| `GUIDE.md` | Non-developer user guide and demo script |
| `GUIDE.pdf` | PDF export of GUIDE.md |
| `public/build.zip` | Frontend build archive |

---

## Architecture at a Glance

```
app/
  Http/Controllers/
    Unauth/          — Public website controllers (Home, Space, Reservation, ContactUs)
    BookingController.php
    PaymentController.php
    RoomController.php
    ScheduleController.php
    ScheduleOverrideController.php
    AmenityController.php
    LayoutController.php
    PaymentProviderController.php
    UserController.php
    LogController.php
    DatabaseController.php
    Settings/
      Website/       — Appearance, Legal, Database settings
      Email/         — Email template settings
  Models/
  Services/
    VoucherService.php   — Generates XXXX-XXXX-XXXX-XXXX codes + QR PNG
  Console/Commands/
    UpdateExpiredBookings.php   — Auto-cancels expired pending bookings
    BackupDatabase.php          — Scheduled DB backup

resources/
  views/
    app.blade.php               — Inertia SPA shell
    emails/                     — Blade email templates (4 customer emails)
  js/                           — React/Inertia pages (all UI)

routes/
  web.php                       — All routes (public + admin)
  api.php                       — /api/bookings/verify, /cron/run/{token}

config/
  global.php                    — App constants (statuses, pagination, file limits)
```

---

## Key Business Logic

### Booking Status Flow
```
INQUIRY (1) → PENDING (2) → CONFIRMED (3)
                    ↘
                  CANCELED (4)
```
- **Inquiry** and **Canceled** do NOT block time slots. Only **Pending** and **Confirmed** do.
- Pending bookings with a past `expires_at` are auto-canceled by the `UpdateExpiredBookings` cron command.
- Confirmed bookings are locked — no edits or cancellations.
- A voucher code (`XXXX-XXXX-XXXX-XXXX`) and QR PNG are generated on confirmation.

### Availability Resolution (per booking request)
1. Check for a `ScheduleOverride` on the requested date → override wins if found.
2. Fall back to the room's assigned `Schedule` → check day hours, `max_day`, `max_date`.
3. Check existing Pending/Confirmed bookings don't fill `qty` for any hour in range.

### Payments
- All manual (no payment gateway). Staff record payments after offline transfer.
- A booking can have multiple partial payments.
- Booking can only be confirmed when sum of `Paid` payments ≥ `total_price`.

---

## Known Issues / Watch Points

- Logo/favicon upload was recently fixed (commits `851e6a7`, `d2e65b8`) — keep an eye on edge cases with file type validation.
- CRON setup was tested with per-minute runs; now set to daily. The external trigger endpoint (`/cron/run/{token}`) is live.
- DB backup SQL generation was patched (`c8823b5`) — verify backup files are valid on next restore test.
- ~~Settings cache stale bug~~ — **resolved** (`6128b6c`). `EmailSettings` and `WebsiteSettings` now use 1hr TTL instead of `rememberForever`. Run `php artisan cache:clear` on server if email template values are still blank.

---

## What's Likely Next

- Demo preparation — `GUIDE.md` has a full demo script (Part 13) ready.
- Run `php artisan migrate` on server to apply the `EMAIL_SETTINGS_BCC` settings row migration.
- No open branches or PRs at this time.

---

## How to Update This File

This file is auto-updated by a Claude Code hook after every `git commit` made within a Claude Code session. When picking up the project, if the last update timestamp looks stale, run:

```
git log --oneline -20
git status
```

...and update the relevant sections manually, or ask Claude to refresh it.
