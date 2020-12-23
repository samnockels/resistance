import axios from 'axios'
import { RESISTANCE_API_BASE_URL } from '../config'

let globalAxios;

export function axiosInstance() {
    if (!globalAxios) {
        globalAxios = axios.create({
            baseURL: RESISTANCE_API_BASE_URL,
            timeout: 1000
        })
    }
    return globalAxios;
}