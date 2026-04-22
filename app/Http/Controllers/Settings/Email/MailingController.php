<?php

namespace App\Http\Controllers\Settings\Email;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MailingController extends Controller
{
    public function index()
    {
        $data = Settings::pluck('value', 'key');

        return Inertia::render('settings/email/mailing', [
            'mailingSettings' => [
                'bcc' => $data['EMAIL_SETTINGS_BCC'] ?? null,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'bcc' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if (!$value) return;
                foreach (array_map('trim', explode(',', $value)) as $email) {
                    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $fail("\"$email\" is not a valid email address.");
                    }
                }
            }],
        ]);

        Settings::where('key', 'EMAIL_SETTINGS_BCC')->update(['value' => $validated['bcc']]);

        cache()->forget('email_settings');

        return to_route('settings.email.mailing')->withSuccess('Mailing configuration updated successfully!');
    }
}
