<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            [
                'name' => 'Superadmin',
                'description' => 'Full system access with all permissions',
                'permissions' => json_encode([
                    'users' => ['create' => true, 'read' => true, 'update' => true, 'delete' => true],
                    'divisions' => ['create' => true, 'read' => true, 'update' => true, 'delete' => true],
                    'roles' => ['create' => true, 'read' => true, 'update' => true, 'delete' => true],
                    'reports' => ['create' => true, 'read' => true, 'update' => true, 'delete' => true],
                ]),
            ],
            [
                'name' => 'Admin',
                'description' => 'Administrative access with limited system configuration',
                'permissions' => json_encode([
                    'users' => ['create' => true, 'read' => true, 'update' => true, 'delete' => false],
                    'divisions' => ['create' => true, 'read' => true, 'update' => true, 'delete' => false],
                    'roles' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'reports' => ['create' => true, 'read' => true, 'update' => true, 'delete' => true],
                ]),
            ],
            [
                'name' => 'Contributor',
                'description' => 'Can create and modify content but cannot delete',
                'permissions' => json_encode([
                    'users' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'divisions' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'roles' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'reports' => ['create' => true, 'read' => true, 'update' => true, 'delete' => false],
                ]),
            ],
            [
                'name' => 'Viewer',
                'description' => 'Can read only',
                'permissions' => json_encode([
                    'users' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'divisions' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'roles' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                    'reports' => ['create' => false, 'read' => true, 'update' => false, 'delete' => false],
                ]),
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']], // Check for existing role by name
                $role // This will be used to create or update the role
            );
        }
    }
}