import { sanctumRequest } from "@/services/sanctumRequest"

export const getRoles = async () => {
    const response = await sanctumRequest('GET', '/role')
    return response.data
}

export const assignRole = async (formData: FormData) => {
    const response = await sanctumRequest('POST', '/assign-role', formData)

    return response.data
}