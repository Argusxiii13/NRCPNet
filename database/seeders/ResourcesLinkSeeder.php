<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResourcesLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('resources_link')->insert([
            [
                'name' => 'Example System 1',
                'link' => 'https://www.example1.com',
                'icon' => '/image/CompanyLogo.jpg',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Example System 2',
                'link' => 'https://www.example2.com',
                'icon' => '/image/CompanyLogo.jpg',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Example System 3',
                'link' => 'https://www.example3.com',
                'icon' => '/image/CompanyLogo.jpg',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Example System 4',
                'link' => 'https://www.example4.com',
                'icon' => '/image/CompanyLogo.jpg',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Example System 5',
                'link' => 'https://www.facebook.com',
                'icon' => '/image/CompanyLogo.jpg',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}