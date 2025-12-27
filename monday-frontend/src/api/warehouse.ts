import { sanctumRequest } from "@/services/sanctumRequest";

export const getWarehouses = async () =>
  (await sanctumRequest("GET", "/warehouse")).data;

export const getWarehouseById = async (id: string | undefined) =>
  (await sanctumRequest("GET", "/warehouse/" + id)).data;

export const createWarehouse = async (formData: FormData) =>
  (
    await sanctumRequest("POST", "/warehouse", formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;

export const updateWarehouse = async (
  formData: FormData,
  id: string | undefined
) =>
  (
    await sanctumRequest("POST", `/warehouse/${id}`, formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;

export const warehouseProductAssign = async (
  formData: FormData,
  id: string | undefined
) => (await sanctumRequest("POST", `/warehouse-product/${id}`, formData)).data;

export const getByWarehouseIdAndProductId = async (
  warehouseId: string | undefined,
  productId: string | undefined
) => {
  const response = await sanctumRequest(
    "GET",
    `/warehouse-product/${warehouseId}/${productId}`
  )
  return response.data;
};
