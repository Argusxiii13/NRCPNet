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
            'middle_name' => $this->faker->lastName(), // Optional middle name
            'surname' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(), // Unique email
            'position' => $this->faker->jobTitle(),
            'section' => $selectedSection,
            'division' => $selectedDivision->name,
            'status' => $this->faker->randomElement(['Active', 'Inactive', 'Suspended']),
            'last_login' => $this->faker->optional()->dateTime(), // Optional last login time
            'user_activity' => $this->faker->text(),
            'role' => $roles->random()->name, // Randomly select a role
            'password' => Hash::make('password'), // Default password
            'remember_token' => Str::random(10),
        ];
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