<?php

namespace App\Http\Controllers;

use App\Models\MailLog;
use Inertia\Inertia;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function mail()
    {
        $mailLogs = MailLog::orderBy('created_at', 'desc')->paginate(config('global.pagination_limit'));

        return Inertia::render('log/mail/index', [
            'mailLogs' => $mailLogs,
        ]);
    }
}
