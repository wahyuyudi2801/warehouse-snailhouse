<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function profile()
    {
        return response()->json(new UserResource(Auth::user()));
    }

    public function index()
    {
        try {
            $fields = ['id', 'name', 'email', 'photo', 'phone'];
            $users = $this->userService->getAll($fields);

            return response()->json(UserResource::collection($users));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    public function keepers()
    {
        try {
            $fields = ['id', 'name', 'email', 'photo', 'phone'];
            $users = $this->userService->getKeepers($fields);

            return response()->json(UserResource::collection($users));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    public function show(int $user)
    {
        try {
            $fields = ['id', 'name', 'email', 'photo', 'phone'];
            $user = $this->userService->getById($user, $fields);

            return response()->json(new UserResource($user));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    public function store(UserRequest $request)
    {
        $user = $this->userService->create($request->validated());

        return response()->json(new UserResource($user));
    }

    public function update(UserUpdateRequest $request, int $userId)
    {
        try {
            $user = $this->userService->update($userId, $request->validated());

            return response()->json(new UserResource($user));
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
    }

    public function destroy(int $userId)
    {
        try {
            $this->userService->delete($userId);

            return response()->json([
                'message' => 'user deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'user not found'
            ], 404);
        }
    }
}
