<?php

namespace App\Services;

use App\Repositories\WarehouseRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class WarehouseService
{
    private $warehouseRepository;

    public function __construct(WarehouseRepository $warehouseRepository)
    {
        $this->warehouseRepository = $warehouseRepository;
    }

    public function getAll(array $fields)
    {
        return $this->warehouseRepository->getAll($fields);
    }

    public function getById(int $id, array $fields)
    {
        return $this->warehouseRepository->getById($id, $fields);
    }

    public function getByWarehouseIdAndProductId(int $warehouseId, int $productId, array $fields)
    {
        $warehouseProduct = $this->warehouseRepository->getByWarehouseIdAndProductId($warehouseId, $productId, $fields);
        return $warehouseProduct;
    }

    public function create(array $data)
    {
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->warehouseRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $fields = ['id', 'photo'];

        $warehouse = $this->warehouseRepository->getById($id, $fields);

        if(isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            if(!empty($warehouse->photo)) {
                $this->deletePhoto($warehouse->photo);
            }

            $data['photo'] = $this->uploadPhoto($data['photo']);
        }

        return $this->warehouseRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        $fields = ['id', 'photo'];
        $warehouse = $this->warehouseRepository->getById($id, $fields);

        if(!empty($warehouse->photo)) {
            $this->deletePhoto($warehouse->photo);
        }

        $this->warehouseRepository->delete($id);
    }

    // add product to warehouse
    public function attachProduct(int $warehouseId, int $productId, int $stock)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);
        $warehouse->products()->syncWithoutDetaching([
            $productId => ['stock' => $stock]
        ]);
    }

    // delete product for warehouse
    public function detachProduct(int $warehouseId, int $productId)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);
        $warehouse->products()->detach($productId);
    }

    // update stock product in warehouse
    public function updateProductStock(int $warehouseId, int $productId, int $stock)
    {
        $warehouse = $this->warehouseRepository->getById($warehouseId, ['id']);

        // update stock at pivot table (warehouse_product)
        $warehouse->products()->updateExistingPivot($productId, [
            'stock' => $stock
        ]);

        return $warehouse->products()->where('product_id', $productId)->first();
    }



    private function uploadPhoto(UploadedFile $photo)
    {
        return $photo->store('warehouses', 'public');
    }

    private function deletePhoto(string $photoPath)
    {
        $relativePath = 'warehouses/' . basename($photoPath);
        if(Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
