# MakeShift — Developer Handover

> Auto-updated after each commit. Read this first when picking up the project.
> Last updated: 2026-09-27 (latest: 121de5d + uncommitted itemised email deductions)

---

## Project Overview

MakeShift is a Laravel + Inertia.js (React) space booking platform for a co-working/event venue business in the Philippines (PHP, Asia/Manila timezone). It has a public-facing website for customer inquiries and an admin panel for staff to manage bookings, payments, rooms, and settings.

**Stack:** Laravel (PHP), Inertia.js, React, TypeScript, Tailwind CSS, MySQL
**Local dev:** XAMPP at `/Applications/XAMPP/xamppfiles/htdocs/MakeShift`
**Admin login:** `/auth-access` (hidden from public)

---

## Current Branch

**Branch:** `dev` — 6 commits ahead of `master` (`94033fc`, `eae6a2e`, `1cfb7cf`, `a48a053`, `71f17dc`, `121de5d`), not pushed. Working tree carries the uncommitted **itemised email deductions** fix (top row of Recent Work).

---

## Recent Work (Last 20 Commits)

| Commit | Summary |
|--------|---------|
| *(uncommitted)* | **Deductions are cleared when a booking changes room.** Follow-on from the email audit: because `total_price()` floors at 0 while `discount_amount()` does not, moving a booking to a cheaper room produced a customer email reading `Subtotal PHP 72.00 / Discount - PHP 2,700.00 / Total PHP 0.00` — arithmetic the recipient can see is broken. A deduction priced against another room's rate isn't stale, it's **void** (the promo/voucher may not even cover the new room), so `Booking::booted()` now deletes all `booking_discounts` rows on `wasChanged('room_id')`. Put on the **model**, not the controller, so every write path is covered. `BookingController::update()` detects the case beforehand and appends an explanatory line to the success flash, since the total visibly moves. Verified: room change clears both rows and the same scenario now emails `Subtotal/Total PHP 72.00` with no contradictory line; non-room edits (time, note, phone) and re-saving the *same* room both preserve the rows. Note an earlier suggestion of mine to clamp `discount_amount()` to the subtotal was **wrong** once emails itemise rows — the individual line amounts would still sum past the subtotal. |
| *(uncommitted)* | **Itemised discount/voucher lines in customer emails.** User reported the "Set as Pending & Notify" email not appearing to deduct the voucher. **The totals were always correct** (audited all 6 emails against `rate × hours × qty − auto − voucher`; every total and Amount Due matched) — the bug was labelling: `DiscountService::mailData()` returned one summed `booking_discount` plus comma-joined names, and all four money templates rendered it as a single hardcoded `Discount (name1, name2)` row. The voucher's amount was inside that figure but never had its own line, and a **voucher-only booking was actively mislabelled** "Discount (voucher name)". `mailData()` now also returns `booking_deductions` — one entry per `booking_discounts` row with `label` (Discount vs Voucher, keyed off `source`), `name` and formatted `amount` — and the four templates (`submitted`, `acknowledged`, `confirmed`, `rescheduled`) loop it. The two legacy keys stay populated: `booking_discount` is still the outer "any deduction at all?" flag, and each template keeps a `@if (empty($data['booking_deductions']))` fallback so a payload built without the new key still renders as before (verified). **No Mailable changes were needed** — those templates read the public `$data` array, and the `with()` lists inside each `build()` are dead code (`content()`/`envelope()` take precedence). Also guarded 3 × `$booking->layout->name` in `BookingController` with `?->` (`layout?->name ?? 'No layout'`): 12 local rooms have no layouts, so a booking against one would have warned mid-email-build. Note `??` alone does **not** suppress a null property read — the nullsafe operator is required. |
| `121de5d` | **"Set as Paid" shortcut on Payments.** Marking a payment received meant opening Edit, changing the status dropdown and filling `amount_paid`. Now a green `BadgeCheck` icon on the payments list row and a **Set as Paid** button on `payment/show.tsx` open a shared confirmation dialog (`payment/set-paid-dialog.tsx`) → `PUT /payments/{payment}/set-paid` (`PaymentController::setPaid`). **It writes `amount_paid = amount`, not just the status** — `Booking::total_paid()` only sums `amount_paid` on Paid rows, and 5 of the 6 pending payments in the local DB had `amount_paid = 0`, so a status-only flip would have left the booking no closer to confirmable (verified end-to-end: booking `total_paid` updates and the confirm gate opens). The dialog states the exact figure and warns when it replaces a smaller recorded amount; partial payments still go through Edit. `paid_at` is an optional `datetime-local` pre-filled with now (or the payment's existing value), matching the edit form where it's `nullable`; submitted value wins, else the existing value, else `now()`. Guards: payment must be Pending **and** its booking Pending (verified rejected for already-paid payments and for Inquiry/Confirmed/Canceled bookings, with no state change). Reuses the previously **dead** `UpdatePaymentStatusRequest` (it existed with no route or controller method), whose `status` rule is now `sometimes` since the shortcut sends only `paid_at` and decides the target status itself. New `utils/payments.ts::canSetPaid()` is shared by both surfaces so the button's visibility can't drift from the server guard. |
| `71f17dc` | **Vouchers module — customer-selectable stacking offers.** Discounts resolve automatically and only one wins; vouchers are the opposite — gated behind criteria, chosen by the customer, and they **stack**. New `vouchers` table + `room_voucher` pivot (`Voucher` model mirrors `Discount`: same traits, `perHourAmount()`, `label()`, plus `criteriaLabel()` and `qualifies()`), criteria being `min_hours` and/or `min_spend` (**spend is checked against the subtotal BEFORE any discount**, so qualification doesn't drift as promos change). Full CRUD at `/vouchers` (Spaces group, `Ticket` icon), generated from the Discounts module minus the overlap badging — vouchers never compete, so `priority` is display order only. **`booking_discounts` is reused as the single deductions ledger** (new nullable `voucher_id`; `source` 3 = voucher): `Booking::total_price()` already sums all rows, so stacking needed **zero** changes to the model, the confirm gate, payments or any of the 5 emails — `mailData()` picks both up for free. New `OfferService` (deliberately **not** `VoucherService`, which already exists and generates check-in QR codes — unrelated concept, same word) exposes `availableFor()` (returns non-qualifying vouchers too, with a `shortfall` so the UI can say "2 more hours") and `applyTo()`, which **re-validates everything server-side** and never touches `source = auto` rows. Both deductions come off the original rate — additive, never compounding. Surfaces: the **Inquire Now modal** (`unauth/space/show.tsx`), the public inquiry page (`unauth/reservation/inquire.tsx`), and the admin booking show page (Inquiry/Pending only, `PUT /bookings/{booking}/voucher`), all sharing `components/custom/voucher-picker.tsx`. The modal is the one case where hours aren't known server-side — the customer is still changing them — so `OfferService::catalogFor()` sends the hours-independent fields (including `room_price`) and `resources/js/utils/vouchers.ts::evaluateVouchers()` recomputes `qualifies`/`total_savings`/`shortfall` reactively, mirroring `Voucher::qualifies()`. **That mirror is presentational only** — `applyTo()` re-validates on submit, so client drift can mislead the display but never the price charged. **Post-edit staleness is surfaced, not auto-fixed:** `OfferService::staleApplied()` re-checks the frozen voucher against the booking's current state (voucher deleted/deactivated, room no longer covered, date outside the reservation window, `min_hours`/`min_spend` no longer met, or the frozen amount drifting from what it would be now) and `booking/show.tsx` renders an amber banner with the reasons plus an inline **Remove**. Deliberately not auto-removed — that would silently re-price a booking on an unrelated edit, which is the exact thing the discount design avoids. Verified against all six invalidation paths. **Known residual:** the stale amount is still deducted until staff act, so a voucher frozen against an expensive room can over-discount a cheap one (worst case the total floors at 0 via `max(0, …)` in `total_price()`); a subtotal clamp was discussed and deferred. A claimed voucher rides the GET hop to `/inquire` as `voucher_id` (added to the base rules of `StoreInquireRequest`) and is re-checked against the server-computed list before being honoured; shrinking the time range drops a voucher that stops qualifying. `DiscountService::previewRecalculation()`/`previewReschedule()` were fixed to carry the voucher amount onto **both** sides — otherwise recalculating the automatic promo would have looked like it wiped the customer's claimed voucher. Verified via tinker: stacking math (₱21,000 − ₱600 promo − ₱2,100 voucher = ₱18,300), full public inquiry E2E with mail, tamper attempts (unmet criteria, wrong room) silently dropped without failing the booking, admin apply/swap/remove, and the Confirmed-booking guard. |
| `a48a053` | **"Set as Pending" modal with optional notify.** Inquiry → Pending used a bare browser `confirm()` and staff then had to click **Notify** separately. Now the Pending dropdown item opens a dialog (`booking/show.tsx`) with a **Payment Deadline (Expires At)** `datetime-local` field and two actions: **Set as Pending** and **Set as Pending & Notify** — the deadline is optional for both (the acknowledged email already prints `N/A` when `expires_at` is null). `UpdateBookingStatusRequest` gained `notify` (`nullable|boolean`) and `expires_at` (`nullable|date|after:now`). `BookingController::updateStatus()` `pending` case now saves `expires_at`, optionally sends the acknowledged mail, and **returns early** so the trailing `expires_at => null` reset (still applied for inquiry/confirmed/canceled) no longer wipes it. The `InquiryAcknowledged` payload was extracted into private `sendAcknowledgedMail()` shared by the existing `sendAcknowledgedEmail()` route and the new path. `hooks/use-update-status.ts` gained `options.skipConfirm` (dialog callers) and `options.data` (merged via `form.transform`), and uses `preserveState: 'errors'` for dialog callers so a validation failure keeps the dialog open with the inline `expires_at` error. Verified via tinker with `Mail::fake()`: past-deadline validation, plain pending (no mail, null deadline), pending+notify with and without a deadline (1 mail each), inquiry reset clears deadline. |
| `1cfb7cf` | **Open-inquiry count badge on the Bookings sidebar item.** `HandleInertiaRequests` shares a lazy `inquiryCount` (only when `$request->user()` — never runs on the public site); `NavItem` gained optional `badge`; `nav-main.tsx` renders it with `SidebarMenuBadge` (hidden when 0 and when collapsed to icons); `app-sidebar.tsx` maps it onto the `/bookings` entry. |
| `eae6a2e` | **Ignore and untrack `.DS_Store`.** Six were tracked and no ignore rule existed, so Finder kept dirtying the tree. `git rm --cached` + `.gitignore` entry. |
| `94033fc` | **Reschedule Confirmed bookings.** Confirmed (paid) bookings were fully locked; staff can now move one to a new date/time in the **same room** without touching the paid total. New **Reschedule** button on `booking/show.tsx` (Confirmed only) opens `booking/reschedule-dialog.tsx`: pick a date → `GET /api/bookings/{booking}/reschedule-options?date=` (`Api\BookingController::rescheduleOptions`) returns the start slots where the booking's **original duration fits entirely** plus a pricing preview; the end time is derived (start + `total_hours()`) and read-only, so `total_price()` (computed live from hours × rate − discount snapshot) can never drift. Submit → `PUT /bookings/{booking}/reschedule` (`BookingController::reschedule`, `RescheduleBookingRequest`): re-verifies availability server-side, updates `start_date/start_time/end_time`, **appends a log line to `note`** (`[YYYY-MM-DD HH:mm by {admin}] Rescheduled from … to …. {optional note}`), and sends the new `BookingRescheduled` mail (`emails/inquiry/rescheduled.blade.php`, BCC wired like the others; voucher/QR unchanged and still valid since verification keys on `voucher_code` only). The discount snapshot is deliberately **not** rewritten; `DiscountService::previewReschedule()` only shows staff the locked total vs. what the new date would normally cost. Supporting changes: `RoomAvailabilityService::verifyRoomAvailability()` gained a trailing `?int $excludeBookingId` so a booking can shift within its own day; the public inquiry form's time-slot logic was extracted from `Unauth\SpaceController::show()` into `RoomAvailabilityService::availableTimesForDate()` (behavior identical, now shared) plus `availableStartTimes()`; `bookings.note` widened `string(255)` → `TEXT` via `2026_09_22_000000_change_note_to_text_on_bookings_table` (note validation raised to `max:5000`), and the Notes cell on the show page renders `whitespace-pre-line`. No limit on how many times a booking can be rescheduled. Smoke-tested via tinker against booking #102: self-exclusion, duration-aware start slots, and pricing preview all behave as expected; `tsc`/ESLint clean on the new files. |
| `599b7dc` | **Announcement banner: aspect-ratio labels + 5MB upload limit.** The Announcements uploader (Settings → Website → Appearance) showed exact pixel resolutions ("2172 × 596px" / "1080 × 1080px") next to the upload slots even though the site doesn't enforce those exact dimensions — replaced with the actual constraint, aspect ratio ("16:9 aspect ratio" / "1:1 aspect ratio"). Also raised the per-image upload cap from 2MB to 5MB: client-side `maxFileSize` in `announcements-uploader.tsx` and the shared `banner_max_size` config (`config/global.php`, 2048 → 5120 KB) used by both `AnnouncementController` and `RoomController` uploads, so this also raises the limit for Room images. Fixed the public home page's desktop announcement image (`unauth/home/index.tsx`), which still used the old fixed-resolution `aspect-[2172/596]` class instead of `aspect-video` (16:9) — mobile was already correctly `aspect-square` (1:1), no change needed there. **Not yet done by the user:** local `php.ini` (`/opt/homebrew/etc/php/8.3/php.ini`) still caps `upload_max_filesize` at 2M, which will reject files between 2–5MB with a generic "failed to upload" validation error until it's raised (user said they'd handle this themselves — needs `upload_max_filesize = 6M` or higher, then a PHP service restart). |
| `a0ff6ae` | **Scoped dark mode to admin pages only.** Dark mode was driven by one global cookie/`<html>` class shared across the whole app, so an admin's dark preference leaked onto the public customer site — both on first load and, since this is one Inertia SPA instance, across client-side navigation between admin and public pages (the class just stuck around, no reload to reset it). Fixed at both layers using the same public/admin boundary already established elsewhere in the codebase (the `Unauth\*` controller namespace / matching `unauth/*` Inertia component names): `app/Http/Middleware/HandleAppearance.php` now forces `$appearance = 'light'` server-side whenever the resolved route's controller is under `\Unauth\`, which flows into both the server-rendered `<html class>` and the FOUC-prevention inline script in `app.blade.php`. Client-side, `resources/js/hooks/use-appearance.tsx` tracks the current page's component name (seeded from Inertia's `data-page` payload on boot — `router` has no public "current page" accessor — then kept in sync via `router.on('navigate', ...)`) and `applyTheme()` refuses to add `.dark` whenever that component starts with `unauth/`. The staff login page (`/auth-access`) correctly keeps dark mode despite being reached unauthenticated, since its controller isn't under `Unauth\`. Verified with real HTTP requests carrying a `appearance=dark` cookie: `/` and `/spaces` render `class=""`, `/auth-access` renders `class="dark"`. |
| `5383fda` | **Per-slide mobile images for the Announcements banner.** `announcements.mobile_image` (nullable string) added via migration. Each slide in Settings → Portal Appearance → Announcements now gets an optional small squarish mobile-image slot alongside its required wide desktop image, uploaded/removed independently (`AnnouncementController::images()` extended with `mobile_file`/`mobile_url` per slide, same "declarative full resave" pattern as the existing desktop flow — full state resent every save, so an omitted mobile field means "removed"). Replacing or removing a mobile image deletes the old file from storage rather than orphaning it; the existing end-of-request sweep (deletes rows not touched this save) now also cleans up their `mobile_image` file. Public home page (`unauth/home/index.tsx`) renders two `<img>`s per slide, CSS-toggled by breakpoint (`hidden md:block` / `md:hidden`, no JS/hydration concerns): desktop always shows the wide image (`aspect-[2172/596]`); mobile **always** uses `aspect-square` — including the fallback case where a slide has no dedicated mobile image, which now center-crops the desktop image into a square rather than preserving its wide shape. That fallback design changed mid-implementation: the carousel (`components/ui/carousel.tsx`, shared with other sliders in the app, not modified) lays all slides in one flex row, so a mobile-first attempt that kept mismatched aspect ratios per slide left a visible empty gap under the shorter slide — first suspected to be a `flex` stretch issue (tried `items-start`, didn't fix it) and then correctly diagnosed as the flex row's height being driven by the *tallest* slide regardless of `align-items`. Forcing every mobile slide to the same ratio was the actual fix. **Caveat to flag to the user if it comes up again:** a slide with a very wide desktop image and no mobile image will now have its sides cropped off on mobile — worth nudging admins to upload a mobile image per slide for the best result. |
| `3e9e4f7` | **Fare-style rate calendar** on the public room page's "Inquire Now" date field, replacing the native `<input type="date">`. Built on `react-day-picker` (new dependency) + a new shadcn-style `components/ui/calendar.tsx` wrapper; `components/custom/room-date-picker.tsx` is the room-specific Popover+Calendar combining rate lookups. New public (unauthenticated) endpoint `GET /api/spaces/{roomName}/rate-calendar?from=&to=` (`Api\Unauth\RoomCalendarController`) returns per-day `{price, original_price, discount_label, closed}` for a bounded range (capped at 62 days), fetched once per visible month — deliberately **not** a query-per-day design. Backed by two new service methods: `DiscountService::pricingForRange()` (one discount query + in-memory per-day containment check, verified to agree exactly with the existing single-date `resolve()`) and `RoomAvailabilityService::closedDaysForRange()` (one Schedule + one bounded ScheduleOverride query, same day-of-week/max_day/max_date/override precedence as the existing single-date check in `SpaceController::show()`, including the override-partially-overlaps-schedule nuance). Scope decision made with the user: closed-day detection is schedule/override-based only, **not** booking-conflict-aware — a day can show open and still turn out fully booked once a specific time is picked, exactly as before; the calendar is a browsing/pricing aid, not the availability authority. Post-build fixes from a full rescan: (1) `month_caption` had `position: relative`, which sat in the same stacking layer as the absolutely-positioned `nav` and, being later in the DOM, silently ate the prev/next month button clicks — removed; (2) the day-cell button had no explicit text color, relying on inherited color through a Radix Popover's portal boundary — pinned to `text-foreground`/`hover:text-accent-foreground` so it can't render invisible against its own hover background; (3) the `selected` day's black fill was applied to both the (square) day cell and the (rounded) button inside it, so a square peeked out around the rounded highlight — now applied only to the button; (4) `RoomDatePicker`'s `DayButton` render function is now `useCallback`-memoized (was a fresh closure every render, forcing `react-day-picker` to remount the whole day grid — including losing hover/focus — on any unrelated re-render); (5) added a `fetchedMonths` ref cache so reopening the popover on a month already fetched this session skips the network call instead of re-fetching. **Verified**: 4 DB queries total for the endpoint regardless of range size (room, discounts, schedule, overrides — confirmed via query log on a 62-day request), ~15-20ms real response time. |
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
- Confirmed bookings are locked — no edits or cancellations. The one exception is **Reschedule** (same room, same duration, price untouched; appends a log line to `note` and emails `BookingRescheduled`).
- A voucher code (`XXXX-XXXX-XXXX-XXXX`) and QR PNG are generated on confirmation.

### Availability Resolution (per booking request)
1. Check for a `ScheduleOverride` on the requested date → override wins if found.
2. Fall back to the room's assigned `Schedule` → check day hours, `max_day`, `max_date`.
3. Check existing Pending/Confirmed bookings don't fill `qty` for any hour in range (pass `$excludeBookingId` to ignore the booking being rescheduled).

### Voucher Resolution (per booking)
1. `OfferService::availableFor()` lists every **active** voucher covering the room whose booking period contains today and whose reservation window contains the stay date — qualifying or not.
2. A voucher qualifies when **every** non-null criterion passes: `total_hours >= min_hours` and `subtotal >= min_spend` (subtotal = `room.price × hours × qty`, **pre-discount**).
3. Nothing is applied automatically. The customer (or staff) picks one; `OfferService::applyTo()` re-checks all of the above and writes a `booking_discounts` row with `source = 3`.
4. One voucher per booking — applying replaces any existing voucher row. Automatic discount rows are never touched, and vice versa.

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
- **Local `announcements` storage is currently empty.** Verification testing during the mobile-images work exercised the real local DB/storage disk instead of isolated fixtures and ended up deleting the only local test announcement (row + file). No production/shared data was touched (this is local dev only), but a fresh banner image needs to be re-uploaded via Settings → Portal Appearance → Announcements before demoing the home page. Lesson for future backend verification: use disposable fixtures, not the live local announcements table.
- **Local `php.ini` still caps uploads below the new 5MB app limit.** `599b7dc` raised `banner_max_size` (announcements + room images) to 5MB, but local `upload_max_filesize` in `/opt/homebrew/etc/php/8.3/php.ini` is still `2M` (`post_max_size` is 8M, fine). Files between 2–5MB will fail with a generic Laravel "failed to upload" validation error until `upload_max_filesize` is raised (e.g. to `6M`) and the PHP service restarted — user opted to handle this themselves, not yet done as of this entry.
- **Two unrelated things are called "voucher".** `VoucherService` generates the check-in code/QR on a Confirmed booking (`bookings.voucher_code`). The new `Voucher` model / `OfferService` / `/vouchers` CRUD are customer-claimable discount offers. They share no code and no columns. `OfferService` is named that way purely to avoid the collision — rename both one day if it keeps causing confusion.
- **Any new query against `discounts` is automatic-only by definition** — vouchers live in their own table, so no exclusion guard is needed (this was the main reason for choosing a separate table over an `is_voucher` flag).
- **Shortening a booking's hours still leaves an over-generous deduction.** Editing never re-prices (deliberate), so a booking cut from 6h to 2h keeps a long-stay voucher's full amount — ₱3,000 subtotal less ₱2,700 = ₱300. The figures stay internally consistent, so a customer email looks fine; it's the economics that are wrong. `OfferService::staleApplied()` warns staff on the booking page ("Needs 6+ hours — this booking is 2h") but nothing blocks the email. Deliberately not auto-corrected: that would silently re-price on an unrelated edit. The **room**-change case is different and *is* handled — see the row above.
- **Reschedule log lines live in `bookings.note` and are visible to customers.** By design (user's call): every reschedule appends to `note`, and `note` is printed as "Note" in every customer email (including `BookingRescheduled`). Staff should keep the optional reschedule note customer-appropriate. If this ever needs to be internal-only, split it into its own column rather than filtering `note` at send time.
- **Reschedule only accepts whole-hour, same-duration moves.** End time is always `start + (int) total_hours()`; a start slot that would run past midnight is rejected server-side and never offered client-side. Rooms can't change — that's an explicit product decision, not a gap.
- **Mobile announcement slides without a dedicated mobile image get their sides cropped.** The mobile carousel forces every slide to `aspect-square` (including the desktop-image fallback) to keep slide heights uniform — see the `5383fda` entry above for why. Worth nudging admins to upload a mobile image per slide for the best result; the crop is a reasonable fallback, not a broken one.

---

## What's Likely Next

- Commit the itemised-email-deductions fix, then push `dev` (6 commits + this one ahead of `master`). No migrations in this one.
- Run the 3 voucher migrations on the server (`2026_09_23_000000/000100/000200`, `--path` each).
- Browser pass on the voucher picker: inquiry page (locked vs unlocked card, total updating) and the admin booking show dialog. Backend is thoroughly tinker-verified; the React side has only had `tsc`/ESLint/build.
- On the server run `php artisan migrate --path=database/migrations/2026_09_22_000000_change_note_to_text_on_bookings_table.php` (use `--path` because of the migrations-drift issue in Known Issues).
- Do one real browser pass in Brave of both new dialogs — Reschedule (Confirmed booking) and Set as Pending (Inquiry booking); backends verified via tinker, the React side only via `tsc`/ESLint/build.
- **Post-commit doc hook is broken in this environment**: `.claude` hook that auto-updates HANDOVER/GUIDE fails every commit with "Edit permission denied in don't ask mode" and also fires spuriously on non-commit Bash calls. Either grant it Edit/Bash or drop it and keep updating docs by hand (as was done for the last 4 commits).
- `npm install` needed on any other machine/server picking up this branch — `react-day-picker` is a new dependency.
- Run the 4 discount migrations on the server (see the migrations-drift note in Known Issues — use `--path` per migration; a bare `php artisan migrate` will try the two stale Pending rows and fail).
- Two real discounts already exist locally ("Summer Promo", "Better Promo") — review their dates before demoing.
- Demo preparation — `GUIDE.md` has a full demo script (Part 13) ready, including the new Step 14b for Discounts.
- Run `php artisan migrate` on server to apply the `sources` table, `bookings.referred_by` / `bookings.source_id` columns, the `announcements` table, the `announcements.mobile_image` column, plus the `EMAIL_SETTINGS_BCC` settings row migration.
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
