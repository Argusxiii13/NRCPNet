<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Division;
use App\Models\Section;

class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        $divisions = [
            [
                'id' => 1,
                'code' => 'OP',
                'name' => 'Office of the President',
                'has_sections' => false,
                'sections' => [],
            ],
            [
                'id' => 2,
                'code' => 'OED',
                'name' => 'Office of the Executive Directory',
                'has_sections' => false,
                'sections' => [],
            ],
            [
                'id' => 3,
                'code' => 'FAD',
                'name' => 'Finance and Administrative Division',
                'has_sections' => true,
                'sections' => [
                    ['name' => 'Budget Section'],
                    ['name' => 'Accounting Section'],
                    ['name' => 'Cash Section'],
                    ['name' => 'HR Section'],
                    ['name' => 'Records Section'],
                ],
            ],
            [
                'id' => 4,
                'code' => 'RDMD',
                'name' => 'Research and Development Management Division',
                'has_sections' => true,
                'sections' => [
                    ['name' => 'REMS'],
                    ['name' => 'TCDS'],
                ],
            ],
            [
                'id' => 5,
                'code' => 'RIDD',
                'name' => 'Research Information and Data Division',
                'has_sections' => true,
                'sections' => [
                    ['name' => 'IDS'],
                    ['name' => 'LS'],
                    ['name' => 'MIS'],
                ],
            ],
        ];

        foreach ($divisions as $divisionData) {
            $division = Division::create([
                'id' => $divisionData['id'],
                'code' => $divisionData['code'],
                'name' => $divisionData['name'],
                'has_sections' => $divisionData['has_sections'],
            ]);

            foreach ($divisionData['sections'] as $sectionData) {
                $division->sections()->create($sectionData);
            }
        }
    }
}