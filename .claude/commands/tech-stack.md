# Tech Stack Reference

Display the full technology stack for the MakeShift project.

---

## MakeShift — Technology Stack

### Backend
| Technology | Version | Notes |
|---|---|---|
| PHP | ^8.2 | |
| Laravel | ^12.0 | Starter kit: `laravel/react-starter-kit` |
| Inertia.js (Laravel) | ^2.0 | Server-side adapter |
| Ziggy | ^2.4 | Named Laravel routes in JS (`route()` helper) |
| milon/barcode | ^12.0 | QR code PNG generation for booking vouchers |
| Laravel Tinker | ^2.10.1 | REPL |
| Laravel Pint | ^1.18 | PHP code formatter |
| Pest PHP | ^3.7 | Testing framework |

### Frontend
| Technology | Version | Notes |
|---|---|---|
| React | ^19.0.0 | |
| TypeScript | ^5.7.2 | |
| Inertia.js (React) | ^2.0.0 | Client-side adapter |
| Vite | ^6.0 | Build tool |
| Tailwind CSS | ^4.0.0 | |
| shadcn/ui | (via Radix UI) | Component library |
| Radix UI | ^1–2.x | Headless UI primitives |
| Lucide React | ^0.475.0 | Icon library |
| Tiptap | ^3.4.2 | Rich text / WYSIWYG editor |
| tailwind-merge | ^3.0.1 | |

### Database
| Technology | Notes |
|---|---|
| MySQL | Via XAMPP locally |
| Laravel Migrations | Schema management |
| Settings table | Key-value store for all configurable app settings |

### Infrastructure / Tooling
| Tool | Notes |
|---|---|
| XAMPP | Local dev server (`/Applications/XAMPP/xamppfiles/htdocs/MakeShift`) |
| `php artisan serve` | Alternative local server (port 8000) |
| Laravel Scheduler + CRON | Auto-cancel expired bookings, DB backups |
| External CRON endpoint | `GET /cron/run/{token}` for hosts without cron access |

### Key Conventions
- **Pages:** React + Inertia (`resources/js/pages/`) — no separate Blade pages except emails
- **Emails:** Blade templates only (`resources/views/emails/`)
- **Settings:** All in `settings` DB table, cached 1hr via `EmailSettings` / `WebsiteSettings`
- **Auth:** Laravel Breeze-style, admin login at `/auth-access`
- **Vouchers:** `XXXX-XXXX-XXXX-XXXX` alphanumeric codes + QR PNG stored in `storage/app/public/vouchers/`
