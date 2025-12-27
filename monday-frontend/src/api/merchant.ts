import { sanctumRequest } from "@/services/sanctumRequest";

export const getMerchant = async () =>
  (await sanctumRequest("GET", "/merchant")).data;

export const getMerchantById = async (id: string | undefined) =>
  (await sanctumRequest("GET", `/merchant/${id}`)).data;

export const getMerchantByUserId = async () => {
  const response = await sanctumRequest("GET", `/merchant-profile`);
  return response.data
}

export const createMerchant = async (formData: FormData) =>
  (
    await sanctumRequest("POST", "/merchant", formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;

export const updateMerchant = async (
  formData: FormData,
  id: string | undefined
) =>
  (
    await sanctumRequest("POST", `/merchant/${id}`, formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;

export const assignMerchantProduct = async (
  formData: FormData,
  id: string | undefined
) => (await sanctumRequest("POST", `/merchant-product/${id}`, formData)).data;

export const updateMerchantProduct = async (
  formData: FormData,
  id: string | undefined,
  product_id: string | undefined
) =>
  (
    await sanctumRequest(
      "POST",
      `/merchant-product/${id}/${product_id}`,
      formData
    )
  ).data;

export const getByMerchantAndProduct = async (
  merchantId: string | undefined,
  productId: string | undefined
) =>
  (await sanctumRequest("GET", `/merchant-product/${merchantId}/${productId}`))
    .data;
