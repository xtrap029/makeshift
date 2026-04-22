# New Mail Class

Scaffold a new Mailable for MakeShift given `$ARGUMENTS` (mail name / purpose / data fields needed).

## How mail works in this project
- Mail classes live in `app/Mail/` and extend `Illuminate\Mail\Mailable`
- Blade templates live in `resources/views/emails/inquiry/`
- All emails share a master layout: `resources/views/emails/layouts/master.blade.php`
- `$emailSettings` (from `EmailSettings::forBlade()`) is shared with all Blade views via `View::share` in `AppServiceProvider`
- BCC is resolved from `EmailSettings::all()['bcc']` (key: `EMAIL_SETTINGS_BCC`) — always include this
- Sent via `Mail::to($email)->send(new YourMailable($data))` in controllers

## Steps to generate

1. **Mail class** at `app/Mail/{Name}.php`
   - Use `build()` for data passing and `envelope()` for subject + BCC
   - Always include `resolveBcc()` private method and wire it into `envelope(bcc: $this->resolveBcc())`
   - Import `App\Support\EmailSettings` and `Illuminate\Mail\Mailables\Address`

   ```php
   private function resolveBcc(): array
   {
       $bcc = EmailSettings::all()['bcc'] ?? null;
       if (!$bcc) return [];
       return array_filter(array_map(
           fn($e) => new Address(trim($e)),
           explode(',', $bcc)
       ));
   }
   ```

2. **Blade template** at `resources/views/emails/inquiry/{name}.blade.php`
   - Use `@extends('emails.layouts.master')`
   - Set `@section('title', '...')` and `@section('message', '...')`
   - Put booking details and dynamic content in `@section('body')`
   - Access `$emailSettings['templateKey']` for configurable text sections

3. **Register configurable template sections** (optional) — if the email body needs admin-editable content, add keys to `EmailSettings`, `AppearanceController`, and the email settings React page.
