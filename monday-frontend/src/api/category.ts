import { sanctumRequest } from "@/services/sanctumRequest";

export const getCategories = async () =>
  (await sanctumRequest("GET", "/category")).data;

export const createCategory = async (data: FormData) =>
  (
    await sanctumRequest("POST", "/category", data, {
      "Content-Type": "multipart/form-data",
    })
  ).data;

export const updateCategory = async (
  formData: FormData,
  id: string | undefined
) =>
  (
    await sanctumRequest("POST", `/category/${id}`, formData, {
      "Content-Type": "multipart/form-data",
    })
  ).data;
