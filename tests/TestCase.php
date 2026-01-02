<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        $_ENV['CACHE_STORE'] = 'array';
        $_SERVER['CACHE_STORE'] = 'array';
        $_ENV['APP_KEY'] = $_SERVER['APP_KEY'] = 'base64:'.base64_encode(random_bytes(32));

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        config()->set('database.default', 'sqlite');
        config()->set('database.connections.sqlite.database', database_path('database.sqlite'));
        config()->set('queue.default', 'sync');

        if (! file_exists(database_path('database.sqlite'))) {
            touch(database_path('database.sqlite'));
        }

        return $app;
    }
}
