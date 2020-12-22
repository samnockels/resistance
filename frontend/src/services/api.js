import { axiosInstance } from './http'

export async function login(password) {
    const axios = axiosInstance()
    return await axios.post('/login', {
        body: {
            password
        }
    })
}