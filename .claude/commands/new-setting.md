# New Setting

Add a new configurable setting to MakeShift end-to-end, given `$ARGUMENTS` (setting name / description / which settings group it belongs to: website, email, or database).

## How settings work in this project
- Settings are stored in the `settings` DB table as key-value pairs (key = `SCREAMING_SNAKE_CASE`)
- Retrieved via `Settings::pluck('value', 'key')` — no Eloquent model per key
- Cached in `app/Support/EmailSettings.php` or `app/Support/WebsiteSettings.php` (1hr TTL)
- Cache cleared via `cache()->forget('email_settings')` or `cache()->forget('website_settings')` on save
- Frontend forms use `useForm<FormType>` from `@inertiajs/react`
- Rich text fields use `<Wysiwyg>` from `@/components/custom/wysiwyg`
- Plain text fields use `<Input>` from `@/components/ui/input`

## Steps to generate

1. **Migration** — `database/migrations/{timestamp}_add_{key}_to_settings_table.php`
   - Use `DB::table('settings')->insertOrIgnore([...])` to seed the row
   - Include `down()` that deletes the row

2. **Settings support class** — add the new key to `app/Support/EmailSettings.php` or `app/Support/WebsiteSettings.php` `all()` return array

3. **Controller update** — add field to the relevant settings controller (`index` + `update` methods) in `app/Http/Controllers/Settings/`

4. **Form type** — add field to the relevant interface in `resources/js/types/form.d.ts`

5. **React settings page** — add the field to the relevant settings page in `resources/js/pages/settings/`

6. **Run migration** — `php artisan migrate --path=database/migrations/{filename}`

Then remind the user to run `php artisan migrate` on the server.
