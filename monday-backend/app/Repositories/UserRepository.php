<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function getAll(array $fields)
    {
        return User::select($fields)->with(['merchant', 'roles'])->latest()->paginate(10);
    }

    public function getKeepers(array $fields)
    {
        return User::role('keeper')->select($fields)->latest()->paginate(10);
    }

    public function getById(int $userId, array $fields)
    {
        return User::select($fields)->with(['merchant'])->findOrFail($userId);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(int $userId, array $data)
    {
        $user = User::findOrFail($userId);
        $user->update($data);

        return $user;
    }

    public function delete(int $userId)
    {
        $user = User::findOrFail($userId);
        $user->delete();
    }

    public function getByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }
}
