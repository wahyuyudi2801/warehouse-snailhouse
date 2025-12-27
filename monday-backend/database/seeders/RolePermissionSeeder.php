<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // reset cache permission
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'view user']);
        Permission::create(['name' => 'manage user']);
        Permission::create(['name' => 'manage role']);

        Permission::create(['name' => 'view category']);
        Permission::create(['name' => 'manage category']);

        Permission::create(['name' => 'view product']);
        Permission::create(['name' => 'manage product']);

        Permission::create(['name' => 'view warehouse']);
        Permission::create(['name' => 'manage warehouse']);
        Permission::create(['name' => 'manage warehouse product']);

        Permission::create(['name' => 'view merchant']);
        Permission::create(['name' => 'manage merchant']);
        Permission::create(['name' => 'manage merchant product']);

        Permission::create(['name' => 'view transaction']);
        Permission::create(['name' => 'manage transaction']);

        // create roles
        $managerRole = Role::create(['name' => 'manager']);
        $keeperRole = Role::create(['name' => 'keeper']);

        // add permissons to roles
        $managerRole->givePermissionTo(Permission::all()->except([
            'manage transaction'
        ]));

        $keeperRole->givePermissionTo([
            'view category',
            'view transaction',
            'manage transaction'
        ]);

        // create users
        $userManager = User::create([
            'name' => 'manager',
            'email' => 'manager@test.com',
            'password' => Hash::make('manager123'),
            'photo' => 'default.png',
            'phone' => '08123456789'
        ]);
        $userManager->assignRole($managerRole);

        $userKeeper = User::create([
            'name' => 'keeper',
            'email' => 'keeper@test.com',
            'password' => Hash::make('keeper123'),
            'photo' => 'default.png',
            'phone' => '08987654321'
        ]);
        $userKeeper->assignRole($keeperRole);
    }
}
