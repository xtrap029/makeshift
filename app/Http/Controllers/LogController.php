<?php

namespace App\Http\Controllers;

use App\Models\MailLog;
use App\Http\Requests\FilterMailRequest;
use App\Models\Audit;
use App\Models\User;
use App\Http\Requests\FilterAuditRequest;
use Inertia\Inertia;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private function applyMailFilters($query, array $filters)
    {
        if (!empty($filters['subject'])) {
            $query->where('subject', 'like', '%' . $filters['subject'] . '%');
        }
        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $dateTo = Carbon::parse($filters['date_to'])->endOfDay()->format('Y-m-d H:i:s');
            $query->where('created_at', '<=', $dateTo);
        }
        return $query;
    }

    public function mail(FilterMailRequest $request)
    {
        $filters = $request->validated();

        $query = $this->applyMailFilters(MailLog::query(), $filters);

        if (!empty($filters['group_by']) && $filters['group_by'] === 'subject') {
            $groupedLogs = $query->selectRaw('subject, COUNT(*) as count, MAX(created_at) as last_sent')
                ->groupBy('subject')
                ->orderByDesc('last_sent')
                ->get();

            return Inertia::render('log/mail/index', [
                'mailLogs' => null,
                'groupedLogs' => $groupedLogs,
                'filters' => $filters,
                'isGrouped' => true,
            ]);
        }

        $mailLogs = $query->orderBy('created_at', 'desc')
            ->paginate(config('global.pagination_limit'))
            ->withQueryString();

        return Inertia::render('log/mail/index', [
            'mailLogs' => $mailLogs,
            'groupedLogs' => null,
            'filters' => $filters,
            'isGrouped' => false,
        ]);
    }

    public function mailExport(FilterMailRequest $request): StreamedResponse
    {
        $filters = $request->validated();

        $emails = $this->applyMailFilters(MailLog::query(), $filters)
            ->where('is_subscribed', true)
            ->distinct()
            ->orderBy('to')
            ->pluck('to');

        $filename = 'mail-emails-' . now()->format('Y-m-d') . '.csv';

        return response()->stream(function () use ($emails) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Email']);
            foreach ($emails as $email) {
                fputcsv($handle, [$email]);
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
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
