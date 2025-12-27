import { sanctumRequest } from "@/services/sanctumRequest"

export const getUsers = async () => {
    const response = await sanctumRequest('GET', '/user')
    return response.data
}

export const getKeepers = async () => {
    const response = await sanctumRequest('GET', '/keeper')
    return response.data
}

export const createUser = async (formData: FormData) => {
    const response = await sanctumRequest('POST', '/user', formData, {
        "Content-Type": "multipart/form-data",
    })
    return response.data
}

export const getUserById = async (id: string | undefined) => {
    const response = await sanctumRequest('GET', `/user/${id}`)
    return response.data
}

export const updateUser = async (formData: FormData, id: string | undefined) => {
    const response = await sanctumRequest('POST', `/user/${id}`, formData, {
        "Content-Type": "multipart/form-data",
    })
    return response.data
}