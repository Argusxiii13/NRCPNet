<?php

namespace Database\Factories;

use App\Models\Suggestion;
use App\Models\Division;
use App\Models\Section;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Suggestion>
 */
class SuggestionFactory extends Factory
{
    protected $model = Suggestion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random division
        $division = Division::inRandomOrder()->first();

        // Get a random section from the selected division, if it has sections
        $section = $division && $division->has_sections ? $division->sections()->inRandomOrder()->first() : null;

        return [
            'content' => $this->faker->sentence(), // Random sentence for suggestion content
            'division' => $division ? $division->code : null, // Division code
            'section' => $section ? $section->name : null, // Section name or null
            'status' => 'New', // Default status
            'assignee' => $this->faker->name(), // Random name for assignee (can be null)
            'adminnote' => $this->faker->optional()->sentence(), // Random sentence for admin notes or null
            'created_at' => now(), // Current timestamp for created_at
            'updated_at' => now(), // Current timestamp for updated_at
        ];
    }
}