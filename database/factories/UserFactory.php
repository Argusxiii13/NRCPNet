<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Division;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get all divisions and roles
        $divisions = Division::all();
        $roles = Role::all();

        // Randomly select a division and its section, if available
        $selectedDivision = $divisions->random();
        $selectedSection = $selectedDivision->has_sections 
            ? $selectedDivision->sections->random()->name 
            : null; // No section if `has_sections` is false

        return [
            'first_name' => $this->faker->firstName(),
            'middle_name' => $this->faker->lastName(), 
            'surname' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(), // Unique email
            'position' => $this->faker->jobTitle(),
            'section' => $selectedSection,
            'division' => $selectedDivision->code,
            'status' => $this->faker->randomElement(['Active', 'Inactive', 'Suspended']),
            'last_login' => $this->faker->dateTime(), 
            'user_activity' => $this->faker->text(),
            'role' => $roles->random()->name, // Randomly select a role
            'password' => Hash::make('zxcvbnm'), // Default password
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Create a specific user.
     *
     * @return static
     */
    public function createSpecificUser()
    {
        // Ensure these seeders have been run first
        if (Division::count() === 0 || Role::count() === 0) {
            throw new \Exception('Division and Role seeders must be run before creating a specific user');
        }
    
        $division = Division::where('code', 'OP')->first();
        $role = Role::where('name', 'Superadmin')->first();
        
        if (!$division) {
            throw new \Exception("Division with code 'OP' not found");
        }
        
        if (!$role) {
            throw new \Exception("Role with name 'Superadmin' not found");
        }
        
        return $this->state([
            'first_name' => 'Edward',
            'middle_name' => 'Chronoire',
            'surname' => 'Park',
            'email' => 'GameMaster13@gmail.com',
            'role' => $role->name,
            'division' => $division->code,
            'position' => $this->faker->jobTitle(),
            'section' => $division->has_sections ? $division->sections->random()->name : null,
            'status' => 'Active', // Set a fixed status for consistent testing
            'last_login' => now(),
            'user_activity' => 'Initial login',
            'password' => Hash::make('zxcvbnm'),
            'remember_token' => Str::random(10),
        ])->create(); // Add create() here to actually create the user
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
    
    /**
     * Indicate that the user should have a specific role.
     *
     * @param string $role
     * @return static
     */
    public function withRole(string $role): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => $role,
        ]);
    }
}