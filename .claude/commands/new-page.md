# New Admin Page

Scaffold a complete new admin page for MakeShift following the existing patterns.

## Stack
- **Backend:** Laravel 12, PHP 8.2
- **Routing:** `routes/web.php` — add GET route inside the `auth + verified` middleware group
- **Controller:** `app/Http/Controllers/` — extends `Controller`, returns `Inertia::render('page/index', [...])`
- **Frontend:** React 19 + TypeScript + Inertia.js 2 + Tailwind CSS 4 + shadcn/ui (Radix UI)
- **Page location:** `resources/js/pages/{module}/index.tsx` (or show/create/edit)
- **Layout:** wrap in `<AppLayout breadcrumbs={breadcrumbs}>` from `@/layouts/app-layout`
- **Icons:** Lucide React

## What to generate given `$ARGUMENTS` (page name / description)

1. **Controller** in `app/Http/Controllers/{Name}Controller.php`
   - `index()` method returning `Inertia::render` with relevant data

2. **Route** in `routes/web.php`
   - `Route::get('{slug}', [{Name}Controller::class, 'index'])->name('{name}')`
   - Place inside the `auth + verified` middleware group

3. **React page** at `resources/js/pages/{module}/index.tsx`
   - Import `AppLayout`, `Head` from `@inertiajs/react`
   - Define `breadcrumbs` array with `BreadcrumbItem[]` type
   - Export default function with typed props
   - Use Tailwind for layout

4. **TypeScript type** in `resources/js/types/` if new props are needed

Follow the exact import order and code style seen in existing pages like `resources/js/pages/amenity/index.tsx`.
