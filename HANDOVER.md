# MakeShift — Developer Handover

> Auto-updated after each commit. Read this first when picking up the project.
> Last updated: 2026-07-29 (latest committed: c820877; rate calendar feature below is uncommitted)

---

## Project Overview

MakeShift is a Laravel + Inertia.js (React) space booking platform for a co-working/event venue business in the Philippines (PHP, Asia/Manila timezone). It has a public-facing website for customer inquiries and an admin panel for staff to manage bookings, payments, rooms, and settings.

**Stack:** Laravel (PHP), Inertia.js, React, TypeScript, Tailwind CSS, MySQL
**Local dev:** XAMPP at `/Applications/XAMPP/xamppfiles/htdocs/MakeShift`
**Admin login:** `/auth-access` (hidden from public)

---

## Current Branch

**Branch:** `master` — 4 commits ahead of `origin/master` (not yet pushed).

---

## Recent Work (Last 20 Commits)

| Commit | Summary |
|--------|---------|
| *(uncommitted)* | **Fare-style rate calendar** on the public room page's "Inquire Now" date field, replacing the native `<input type="date">`. Built on `react-day-picker` (new dependency) + a new shadcn-style `components/ui/calendar.tsx` wrapper; `components/custom/room-date-picker.tsx` is the room-specific Popover+Calendar combining rate lookups. New public (unauthenticated) endpoint `GET /api/spaces/{roomName}/rate-calendar?from=&to=` (`Api\Unauth\RoomCalendarController`) returns per-day `{price, original_price, discount_label, closed}` for a bounded range (capped at 62 days), fetched once per visible month — deliberately **not** a query-per-day design. Backed by two new service methods: `DiscountService::pricingForRange()` (one discount query + in-memory per-day containment check, verified to agree exactly with the existing single-date `resolve()`) and `RoomAvailabilityService::closedDaysForRange()` (one Schedule + one bounded ScheduleOverride query, same day-of-week/max_day/max_date/override precedence as the existing single-date check in `SpaceController::show()`, including the override-partially-overlaps-schedule nuance). Scope decision made with the user: closed-day detection is schedule/override-based only, **not** booking-conflict-aware — a day can show open and still turn out fully booked once a specific time is picked, exactly as before; the calendar is a browsing/pricing aid, not the availability authority. Post-build fixes from a full rescan: (1) `month_caption` had `position: relative`, which sat in the same stacking layer as the absolutely-positioned `nav` and, being later in the DOM, silently ate the prev/next month button clicks — removed; (2) the day-cell button had no explicit text color, relying on inherited color through a Radix Popover's portal boundary — pinned to `text-foreground`/`hover:text-accent-foreground` so it can't render invisible against its own hover background; (3) the `selected` day's black fill was applied to both the (square) day cell and the (rounded) button inside it, so a square peeked out around the rounded highlight — now applied only to the button; (4) `RoomDatePicker`'s `DayButton` render function is now `useCallback`-memoized (was a fresh closure every render, forcing `react-day-picker` to remount the whole day grid — including losing hover/focus — on any unrelated re-render); (5) added a `fetchedMonths` ref cache so reopening the popover on a month already fetched this session skips the network call instead of re-fetching. **Verified**: 4 DB queries total for the endpoint regardless of range size (room, discounts, schedule, overrides — confirmed via query log on a 62-day request), ~15-20ms real response time. |
| `c820877` | **Room Discounts module.** Admin-managed discounts that apply automatically to selected rooms — no promo code. New `discounts` table (+ `discount_room` pivot) and `booking_discounts` snapshot table. CRUD at `/discounts` (Spaces group in sidebar). Fixed-amount and percentage types, both applied **per hour** off the room rate. Two independent date windows: **booking period** (vs `bookings.created_at`) and **reservation dates** (vs `bookings.start_date`); all four dates are **mandatory** and bounds are inclusive. Overlaps are allowed and resolved by `priority ASC, id DESC` — **lower number wins**; the admin list badges them. `Booking::total_price()` is now `subtotal() - discount_amount()`, so the confirm gate, all 3 customer emails, and `ContactUsController` became discount-correct with no changes at those call sites. Payment `amount`/`amount_paid` validation relaxed from `integer` to `numeric` (percentage discounts produce decimal totals). Discounts surface on home/spaces/space-detail/inquiry pages and on `booking/show`. Public pages also advertise **upcoming** promos (before a date is picked) via `DiscountService::nextUpcoming()` — flagged `upcoming: true`, never used to cross out a price. Admin **room show page** (`/rooms/{room}`) now lists that room's ongoing/upcoming discounts (below Layouts) as clickable tags opening `/discounts/{id}/edit` in a new tab; expired ones are excluded via `RoomController::show()` filtering `discounts` on `reserve_to >= today`. "Ongoing" is computed server-side (`is_ongoing`) as today falling inside the **booking period only** — a customer inquiring today qualifies regardless of which future stay date (within the reservation window) they pick, since `DiscountService::resolve()` checks the booking period against today but the reservation window against the chosen stay date, not today. Anything whose booking period hasn't opened yet is tagged Upcoming. (Edge case: a discount whose booking period has already *closed* but whose reservation window still extends into the future is also tagged Upcoming, which is a mislabel — there's no third "Closed" state yet.) Booking edits no longer auto-reset the discount snapshot — a small refresh icon beside the discount amount on `booking/show.tsx` (Inquiry/Pending only) opens a Before/After preview dialog (new `GET /api/bookings/{booking}/preview-discount` endpoint, read-only) and only writes the snapshot on explicit confirmation; see the Discount Resolution section for the reasoning. |
| `2067953` | Added announcements uploader |
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
| Rate calendar feature (several files) | See `git status` — new `app/Http/Controllers/Api/Unauth/RoomCalendarController.php`, `resources/js/components/ui/calendar.tsx`, `resources/js/components/custom/room-date-picker.tsx`, plus edits to `DiscountService`, `RoomAvailabilityService`, `routes/api.php`, `unauth/space/show.tsx`, and `package.json`/`package-lock.json` (new `react-day-picker` dependency, already `npm install`ed locally). |

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
      Unauth/
        RoomCalendarController.php — Public (no auth), per-day rate + closed-day JSON for the room date-picker calendar
    BookingController.php
    PaymentController.php
    RoomController.php
    ScheduleController.php
    ScheduleOverrideController.php
    AmenityController.php
    LayoutController.php
    DiscountController.php      — Admin-managed room discounts (auto-applied, no promo code)
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
    DiscountService.php  — Resolves/previews room discounts, writes booking snapshots; pricingForRange() batches per-day rates for the calendar
    RoomAvailabilityService.php — Per-hour availability check (existing); closedDaysForRange() batches per-day open/closed for the calendar
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
  api.php                       — /api/bookings/verify, /api/rooms/{roomId}/images, /api/announcements/images, /api/spaces/{roomName}/rate-calendar (public), /cron/run/{token}

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

### Discount Resolution (per booking)
`DiscountService::resolve($roomId, $reservationDate, $bookedOn)` picks **at most one** discount:
1. `is_active` + **`whereNull('code')`** (a non-null `code` reserves the row for a future coupon feature and opts it out of automatic matching).
2. Room is in the `discount_room` pivot.
3. Booking window contains `$bookedOn` (defaults to now) — inclusive bounds.
4. Reservation window contains `$reservationDate` — inclusive bounds.
5. `ORDER BY priority ASC, id DESC` → first. **Lower number = higher priority** (1 beats 10) — same convention used for the admin list order and the `nextUpcoming()` tiebreaker.

**Money:** `Booking::subtotal()` = `room.price × hours × qty`. Each `booking_discounts` row's `amount` is computed once at snapshot time as `perHourAmount × hours × qty`, where fixed is `min(value, room.price)` (so a rate can't go negative) and percentage is `price × value/100`. `total_price() = max(0, subtotal - sum(amounts))`. Multiple rows deduct from the **original** rate — additive, never compounding — so totals are order-independent.

**Snapshot lifecycle:** `DiscountService::applyTo()` is called from `ReservationController::inquireStore()` and `BookingController::store()` on creation, and from the standalone `BookingController::recalculateDiscount()` action (`GET /bookings/{booking}/recalculate-discount`, guarded to Inquiry/Pending) on demand. It deletes and rewrites only `source = auto` rows (coupon rows would be left alone). Re-resolution passes the booking's original `created_at` so recalculating an old booking doesn't void its promo based on today's date.

**`BookingController::update()` deliberately does *not* call `applyTo()`.** It originally did, but that meant any edit — even an unrelated field like a note — silently rewrote the discount snapshot and shifted the total on a booking that might already have payments recorded. Now the snapshot only changes when staff explicitly trigger it via a **refresh icon** beside the discount amount on `booking/show.tsx` (Inquiry/Pending only; a fallback "Discount" row with just the icon shows when there's currently no discount at all, so a newly-qualifying one can still be picked up). Consequence to know: `Booking::subtotal()` always reads the **live** `room.price`, so editing a booking's room does immediately change the displayed subtotal — but the discount `amount` stays frozen at its old (now-mismatched) value until recalculated. The total is still arithmetically consistent (`subtotal - discount_amount`), just stale, until confirmed.

**Recalculate confirmation flow:** clicking the icon opens a dialog that first fetches a dry-run preview from `GET /api/bookings/{booking}/preview-discount` (`Api\BookingController::previewDiscount()` → `DiscountService::previewRecalculation()`, auth-only, read-only — nothing is written). The response has `before`/`after` sides (`discounts[]`, `discount_amount`, `total_price`) plus a `subtotal` and a `changed` flag; the dialog renders Before vs After and disables nothing on `changed === false` (recalculating is idempotent, so re-applying is harmless — the button just relabels to "Recalculate Anyway"). Only on **Apply Change** does the browser navigate to `GET /bookings/{booking}/recalculate-discount`, which actually calls `applyTo()` and redirects back.

**Public previews:** `DiscountService::preview($room, $date)` resolves for `$date`, or for today when `$date` is null. In the **undated** case only, if nothing applies today it falls back to `nextUpcoming()` — the soonest promo whose reservation window is still ahead but whose **booking window is already open** — returned with `upcoming = true` and `starts_on`. Callers must not discount displayed prices when `upcoming` is true (see `activeDiscount` in `unauth/space/show.tsx`); the flag exists purely to advertise. `ReservationController::inquire()` always passes an explicit date, so `upcoming` is always false there.

**Coupon forward-compat:** `discounts.code` / `max_uses` / `uses_count` exist but are unused. A coupon is meant to be "a discount that requires a code" — same table, same resolve engine, an extra `booking_discounts` row with `source = code`. No schema migration should be needed to add it.

### Payments
- All manual (no payment gateway). Staff record payments after offline transfer.
- A booking can have multiple partial payments.
- Booking can only be confirmed when sum of `Paid` payments ≥ `total_price` — which is now the **discounted** total.
- `amount` / `amount_paid` validate as `numeric` (not `integer`) so decimal totals from percentage discounts pass.

---

## Known Issues / Watch Points

- Logo/favicon upload was recently fixed (commits `851e6a7`, `d2e65b8`) — keep an eye on edge cases with file type validation.
- CRON setup was tested with per-minute runs; now set to daily. The external trigger endpoint (`/cron/run/{token}`) is live.
- DB backup SQL generation was patched (`c8823b5`) — verify backup files are valid on next restore test.
- ~~Settings cache stale bug~~ — **resolved** (`6128b6c`). `EmailSettings` and `WebsiteSettings` now use 1hr TTL instead of `rememberForever`. Run `php artisan cache:clear` on server if email template values are still blank.
- **Announcements uploader can't remove all images**: like the existing Room images uploader it's based on, `/api/announcements/images` requires at least 1 image per submission (`images` validated `required|min:1`), so the "Save" button only appears once ≥1 image is present — there's no way to clear the banner back to zero images from the UI without a DB delete. Same limitation exists for Room images; low priority unless it comes up.
- **Migrations table drift** (pre-existing, unrelated to `78da179`): `php artisan migrate:status` shows `2025_11_16_145305_add_login_at_in_users_table` and `2025_12_22_180756_add_backup_settings_to_settings_table` as "Pending" even though their columns already exist in the local DB. Not caused by recent work — needs reconciling (likely `php artisan migrate:status` was run against a DB that had these columns added manually, or the `migrations` table was reset) before running `php artisan migrate` blindly on any environment sharing that DB.

---

- **`2026_07_23_110000_make_discount_dates_required`** backfills any open-ended discount dates before enforcing NOT NULL: missing `*_from` becomes the row's `DATE(created_at)`, missing `*_to` becomes the `2099-12-31` sentinel. The local "Summer Promo" row was backfilled this way — review its dates before demoing, since `2099-12-31` is a placeholder, not an intended value.
- **Discount previews are per-request, not cached.** `DiscountService::preview()` runs one query per room on `/spaces` and the home slider. Fine at the current room count; worth caching if the room list grows.
- **`Booking::total_price()` lazy-loads `discounts`.** Any new code that calls it over a collection should eager-load `discounts` (as `ContactUsController::resend()` and `PaymentController::payableBookings()` now do) or it will N+1.
- **Rate calendar has had one round of real browser testing** (user caught the nav-button and hover-contrast bugs listed above — both fixed). No headless browser tool has been available in this session to screenshot it directly, so continued manual spot-checks in Brave are worthwhile, but the backend is thoroughly verified (matches `resolve()` exactly, respects the 62-day cap, correct 404/422/public-access behavior, 4 queries total confirmed via query log) and `tsc`/ESLint/build all pass.
- **Closed-day check on the calendar is schedule/override-based only, not booking-aware** (agreed tradeoff for query cost — see Discount/Availability sections above). A day can show open on the calendar and still come back "No available times" once picked, same as before this change.

---

## What's Likely Next

- **Commit the rate calendar feature** — it's complete and backend-verified but uncommitted; do a quick manual visual check in a browser first (see Known Issues).
- `npm install` needed on any other machine/server picking up this branch — `react-day-picker` is a new dependency.
- Run the 4 discount migrations on the server (see the migrations-drift note in Known Issues — use `--path` per migration; a bare `php artisan migrate` will try the two stale Pending rows and fail).
- Two real discounts already exist locally ("Summer Promo", "Better Promo") — review their dates before demoing.
- Demo preparation — `GUIDE.md` has a full demo script (Part 13) ready, including the new Step 14b for Discounts.
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
