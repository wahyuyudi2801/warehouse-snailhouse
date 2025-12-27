<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function login(array $credentials)
    {
        $user = $this->userRepository->getByEmail($credentials['email']);

        if (!$user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'message' => ['Your credential does not match']
            ]);
        }

        $abilities = $user->getAllPermissions()->pluck('name')->toArray();

        return [
            'token' => $user->createToken($user->name . '-AuthToken', $abilities)->plainTextToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->getRoleNames()->first(), // Ambil role pertama
                'merchant' => $user->merchant
            ],
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $request->user()->tokens()->delete();
    }
}
