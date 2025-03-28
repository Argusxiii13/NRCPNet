<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupStorage extends Command
{
    protected $signature = 'app:cleanup';
    protected $description = 'Wipe database and clean storage';

    public function handle()
    {
        // Wipe database
        $this->call('db:wipe');
        
        // Clean feature directory
        Storage::disk('public')->deleteDirectory('resources');
        Storage::disk('public')->makeDirectory('resources');
        Storage::disk('public')->deleteDirectory('feature');
        Storage::disk('public')->makeDirectory('feature');
        
        $this->info('Database and storage cleaned successfully');
        
        // Optionally run migrations and seeders
        $this->call('migrate');
        $this->call('db:seed');
    }
}