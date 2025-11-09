<?php

namespace App\Http\Controllers;

use App\Models\MailLog;
use App\Http\Requests\FilterMailRequest;
use Inertia\Inertia;
use Carbon\Carbon;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function mail(FilterMailRequest $request)
    {
        $filters = $request->validated();

        $mailLogs = MailLog::orderBy('created_at', 'desc');

        if (isset($filters['subject'])) {
            $mailLogs->where('subject', 'like', '%' . $filters['subject'] . '%');
        }

        if (isset($filters['date_from'])) {
            $mailLogs->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $dateTo = Carbon::parse($filters['date_to'])->endOfDay()->format('Y-m-d H:i:s');
            $mailLogs->where('created_at', '<=', $dateTo);
        }

        $mailLogs = $mailLogs->paginate(config('global.pagination_limit'))->withQueryString();

        return Inertia::render('log/mail/index', [
            'mailLogs' => $mailLogs,
            'filters' => $filters,
        ]);
    }
}
