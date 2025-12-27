<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    private ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(array $fields)
    {
        return $this->productRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->productRepository->getById($id, $fields);
    }

    public function create(array $data)
    {
        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
            $data['thumbnail'] = $this->uploadThumbnail($data['thumbnail']);
        }

        return $this->productRepository->create($data);
    }

    public function update(int $productId, array $data)
    {
        $product = $this->productRepository->getById($productId, ['*']);

        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof UploadedFile) {
            if (!empty($product->thumbnail)) {
                $this->deleteThumbnail($product->thumbnail);
            }

            $data['thumbnail'] = $this->uploadThumbnail($data['thumbnail']);
        }

        return $this->productRepository->update($productId, $data);
    }

    public function delete(int $productId)
    {
        $product = $this->productRepository->getById($productId, ['*']);
        if (!empty($product->thumbnail)) {
            $this->deleteThumbnail($product->thumbnail);
        }

        $this->productRepository->delete($productId);
    }

    private function uploadThumbnail(UploadedFile $thumbnail)
    {
        return $thumbnail->store('products', 'public');
    }

    private function deleteThumbnail(string $thumbnailPath)
    {
        $relativePath = 'products/' . basename($thumbnailPath);
        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
