import { sanctumRequest } from "@/services/sanctumRequest";

export const getProducts = async () =>
  (await sanctumRequest("GET", "/product")).data;

export const getProductById = async (id: string | undefined) =>
  (await sanctumRequest("GET", `/product/${id}`)).data;

export const createProduct = async (formData: FormData) =>
  (
    await sanctumRequest("POST", "/product", formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;

export const updateProduct = async (
  formData: FormData,
  id: string | undefined
) =>
  (
    await sanctumRequest("POST", `/product/${id}`, formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;
