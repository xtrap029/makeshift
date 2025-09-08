<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Support\WebsiteSettings;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Blade
        View::share('websiteSettings', WebsiteSettings::forBlade());

        // Inertia
        Inertia::share([
            'websiteSettings' => fn() => WebsiteSettings::forInertia(),
        ]);
    }
}
