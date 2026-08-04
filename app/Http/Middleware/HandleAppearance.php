<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Public-facing pages (Unauth\* controllers) always render light — dark mode
        // is an admin-only preference and must never leak into the customer site,
        // regardless of what the admin's browser has saved.
        $route = $request->route();
        $isPublicPage = $route && str_contains((string) $route->getActionName(), '\\Unauth\\');

        View::share('appearance', $isPublicPage ? 'light' : ($request->cookie('appearance') ?? 'system'));

        return $next($request);
    }
}
