# MakeShift — Developer Handover

> Auto-updated after each commit. Read this first when picking up the project.
> Last updated: 2026-07-22 (latest: 389410d — ahead of origin by 2)

---

## Project Overview

MakeShift is a Laravel + Inertia.js (React) space booking platform for a co-working/event venue business in the Philippines (PHP, Asia/Manila timezone). It has a public-facing website for customer inquiries and an admin panel for staff to manage bookings, payments, rooms, and settings.

**Stack:** Laravel (PHP), Inertia.js, React, TypeScript, Tailwind CSS, MySQL
**Local dev:** XAMPP at `/Applications/XAMPP/xamppfiles/htdocs/MakeShift`
**Admin login:** `/auth-access` (hidden from public)

---

## Current Branch

**Branch:** `master` — 2 commits ahead of `origin/master` (not yet pushed)

---

## Recent Work (Last 20 Commits)

| Commit | Summary |
|--------|---------|
| `389410d` | Added an admin-manageable **Announcements** banner to the home page, shown full-width above the Featured Space section. New `announcements` table/model; images uploaded via `POST /api/announcements/images` (mirrors the Room images upload/reorder/diff-delete pattern). Managed from Settings > Website > Appearance (new "Announcements" section, `resources/js/pages/settings/website/announcements-uploader.tsx`). Static image if 1 uploaded, auto-rotating carousel if 2+, each image optionally links out on click with a "More Info" badge. Also rebalanced the home page's black/white section striping (mobile and desktop) to account for the new top banner. |
| `78da179` | Added "Referred By" (free text) and "How did you hear about us?" (dropdown) to the public inquiry form and admin bookings. New admin-managed **Sources** list (`/sources`, mirrors the Layouts CRUD pattern) backs the dropdown. New `sources` table; new `bookings.referred_by` and `bookings.source_id` columns. Both fields show in booking create/edit/show pages, under the Customer section on the show page. |
| `8e617a1` | Restored date validation in `SpaceController::show()` — only fetch time slots for future dates |
| `c545ec2` | Updated guide and mail message copy |
| `1b5a83a` | Mobile fixes for space inquiry dialog: single-column layout on mobile, focus trap to prevent iOS Chrome auto-opening date picker, guard against empty date navigation, removed invalid-date redirect in `SpaceController::show()` (shows empty slots instead), exposed Vite dev server on `0.0.0.0` for local network testing |
| `490009e` | Wysiwyg editor: added text alignment toolbar buttons (left, center, right, justify) using `@tiptap/extension-text-align` |
| `6f74bed` | Inquiry form: added optional "Subscribe to our newsletter" checkbox |
| `b62ebc4` | Fix: password validation rule casting error in `StoreUserRequest` |
| `04e6f51` | Bookings: filters now work in calendar view; filters reset when switching between calendar and table views |
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
| `.claude/settings.local.json` | Local Claude Code permission overrides (not for git) |

Note: `public/build.zip` was deleted locally (was previously untracked/uncommitted) and `public/build` currently holds a stale compiled bundle from before this session's frontend changes — run `npm run dev` or `npm run build` before relying on the UI in a browser.

---

## Architecture at a Glance

```
app/
  Http/Controllers/
    Unauth/          — Public website controllers (Home, Space, Reservation, ContactUs)
    Api/
      RoomController.php          — Multi-image upload/reorder for rooms
      AnnouncementController.php  — Multi-image upload/reorder for the home page Announcements banner
    BookingController.php
    PaymentController.php
    RoomController.php
    ScheduleController.php
    ScheduleOverrideController.php
    AmenityController.php
    LayoutController.php
    SourceController.php    — Admin-managed inquiry sources ("How did you hear about us?")
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
  api.php                       — /api/bookings/verify, /api/rooms/{roomId}/images, /api/announcements/images, /cron/run/{token}

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
- **Announcements uploader can't remove all images**: like the existing Room images uploader it's based on, `/api/announcements/images` requires at least 1 image per submission (`images` validated `required|min:1`), so the "Save" button only appears once ≥1 image is present — there's no way to clear the banner back to zero images from the UI without a DB delete. Same limitation exists for Room images; low priority unless it comes up.
- **Migrations table drift** (pre-existing, unrelated to `78da179`): `php artisan migrate:status` shows `2025_11_16_145305_add_login_at_in_users_table` and `2025_12_22_180756_add_backup_settings_to_settings_table` as "Pending" even though their columns already exist in the local DB. Not caused by recent work — needs reconciling (likely `php artisan migrate:status` was run against a DB that had these columns added manually, or the `migrations` table was reset) before running `php artisan migrate` blindly on any environment sharing that DB.

---

## What's Likely Next

- Demo preparation — `GUIDE.md` has a full demo script (Part 13) ready.
- Run `php artisan migrate` on server to apply the `sources` table, `bookings.referred_by` / `bookings.source_id` columns, the `announcements` table, plus the `EMAIL_SETTINGS_BCC` settings row migration.
- Populate real "Sources" entries via `/sources` (only 4 sample entries seeded locally: Google Search, Social Media, Referral, Walk-in) before demoing the inquiry form.
- Upload real Announcement banner image(s) via Settings > Website > Appearance before demoing the home page — none are seeded locally, so the banner currently renders nothing.
- No open branches or PRs at this time — 2 local commits (`78da179`, `389410d`) not yet pushed.
- Booking calendar/filter improvements are live — monitor for any edge cases with filter params in the calendar API.

---

## How to Update This File

This file is auto-updated by a Claude Code hook after every `git commit` made within a Claude Code session. When picking up the project, if the last update timestamp looks stale, run:

```
git log --oneline -20
git status
```

...and update the relevant sections manually, or ask Claude to refresh it.
