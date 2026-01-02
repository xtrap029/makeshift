<?php

namespace App\Providers;

use App\Models\Settings;
use App\Observers\BackupSettingsObserver;
use App\Support\EmailSettings;
use App\Support\WebsiteSettings;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
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
        if ($this->app->environment('testing')) {
            config()->set('cache.default', 'array');
        }

        Settings::observe(BackupSettingsObserver::class);

        // Blade
        View::share('websiteSettings', WebsiteSettings::forBlade());
        View::share('emailSettings', EmailSettings::forBlade());

        // Inertia
        Inertia::share([
            'websiteSettings' => fn() => WebsiteSettings::forInertia(),
        ]);
    }
}
