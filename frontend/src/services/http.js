import axios from 'axios'
import { RESISTANCE_API_BASE_URL } from '../config'

let globalAxios;

export function axiosInstance() {
    if (!globalAxios) {
        globalAxios = axios.create({
            baseURL: RESISTANCE_API_BASE_URL,
            timeout: 1000
        })
        globalAxios.interceptors.request.use(
            req => {
                const authToken = sessionStorage.getItem('token')
                if (authToken) {
                    req.headers.common['Authorization'] = authToken
                }
                return req
            },
            error => {
                return Promise.reject(error);
            }
        )
    }
    return globalAxios;
}