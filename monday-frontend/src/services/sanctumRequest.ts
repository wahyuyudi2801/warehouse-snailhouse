/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./api-client";
import { getCsrfToken } from "./csrf";

export const sanctumRequest = async (
  method: string,
  url: string,
  data = {},
  configHeaders: Record<string, any> = {},
  config: Record<string, unknown> = {}
) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Ambil CSRF Token dari cookie
  const csrfToken = await getCsrfToken();

  // Gabungkan headers default
  const defaultHeaders: Record<string, string | number | boolean> = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    defaultHeaders["X-XSRF-TOKEN"] = csrfToken;
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // console.log({
  //   ...defaultHeaders,
  //   ...configHeaders,
  // });

  // Lakukan request ke API
  const response = await apiClient({
    method,
    url: `${API_URL}${url}`,
    data,
    withCredentials: true, // penting untuk cookie CSRF
    headers: {
      ...defaultHeaders,
      ...configHeaders, // merge dengan headers tambahan dari config
    },
    ...config, // config tambahan tetap dipertahankan
  });

  return response;
};
