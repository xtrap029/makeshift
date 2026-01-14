<?php

namespace App\Http\Controllers;

use App\Models\MailLog;
use App\Http\Requests\FilterMailRequest;
use App\Models\Audit;
use App\Models\User;
use App\Http\Requests\FilterAuditRequest;
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

    public function audit(FilterAuditRequest $request)
    {
        $filters = $request->validated();

        $audits = Audit::with('user')->orderBy('created_at', 'desc');

        if (isset($filters['auditable_type'])) {
            $audits->where('auditable_type', 'like', '%' . $filters['auditable_type'] . '%');
        }

        if (isset($filters['event'])) {
            $audits->where('event', $filters['event']);
        }

        if (isset($filters['user_id'])) {
            $audits->where('user_id', $filters['user_id']);
        }

        if (isset($filters['date_from'])) {
            $audits->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $dateTo = Carbon::parse($filters['date_to'])->endOfDay()->format('Y-m-d H:i:s');
            $audits->where('created_at', '<=', $dateTo);
        }

        $audits = $audits->paginate(config('global.pagination_limit'))->withQueryString();

        foreach ($audits as $audit) {
            $audit->auditable_type = ucfirst(str_replace('App\Models\\', '', $audit->auditable_type));
        }

        $userIds = Audit::whereNotNull('user_id')
            ->distinct()
            ->pluck('user_id')
            ->toArray();

        $users = User::whereIn('id', $userIds)->orderBy('name')->get();

        return Inertia::render('log/audit/index', compact('audits', 'users', 'filters'));
    }
}
