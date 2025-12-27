<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UserService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAll(array $fields)
    {
        return $this->userRepository->getAll($fields);
    }

    public function getKeepers(array $fields)
    {
        return $this->userRepository->getKeepers($fields);
    }

    public function getById(int $userId, array $fields)
    {
        return $this->userRepository->getById($userId, $fields);
    }

    public function create(array $data)
    {
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->userRepository->create($data);
    }

    public function update(int $userId, array $data)
    {
        $user = $this->userRepository->getById($userId, ['id', 'photo']);

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            if (!empty($user->photo)) {
                $this->deletePhoto($user->photo);
            }

            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->userRepository->update($userId, $data);
    }

    public function delete(int $userId)
    {
        $user = $this->userRepository->getById($userId, ['id', 'photo']);

        if (!empty($user->photo)) {
            $this->deletePhoto($user->photo);
        }

        $this->userRepository->delete($userId);
    }

    private function uploadPhoto(UploadedFile $photo)
    {
        return $photo->store('profiles', 'public');
    }

    private function deletePhoto(string $photoPath)
    {
        $relativePath = 'profiles/' . basename($photoPath);
        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
