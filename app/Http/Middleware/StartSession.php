<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession as BaseStartSession;

/**
 * StartSession with a read-only mode for background polling.
 *
 * Every request normally renews the session: the driver bumps last_activity and
 * the cookie is re-issued with a fresh expiry. The new-inquiry notification poll
 * runs every 30 seconds from any open admin tab, which would keep a forgotten tab
 * logged in forever. For those requests the session is still *read* — so `auth`
 * knows who is asking — but never saved or re-issued, so the idle timeout keeps
 * counting from the admin's last real activity. Once it lapses the poll gets a
 * 401 and the client stops polling.
 */
class StartSession extends BaseStartSession
{
    /**
     * Requests that may read the session but must not extend it.
     *
     * @var array<int, string>
     */
    protected array $passive = [
        'api/notifications/*',
    ];

    protected function handleStatefulRequest(Request $request, $session, Closure $next)
    {
        if (! $request->is(...$this->passive)) {
            return parent::handleStatefulRequest($request, $session, $next);
        }

        // Load the session so the auth guard can identify the user — then stop.
        // Skipped on purpose: garbage collection, recording this URL as the
        // "previous" page, re-issuing the cookie, and saving (which would bump
        // last_activity and so renew the session).
        $request->setLaravelSession($this->startSession($request, $session));

        return $next($request);
    }
}
