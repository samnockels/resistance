import axios from 'axios'
import config from '../config'

let globalAxios;

export function axiosInstance() {
    if (!globalAxios) {
        const { RESISTANCE_API_BASE_URL } = config()
        globalAxios = axios.create({
            baseURL: RESISTANCE_API_BASE_URL,
            timeout: 1000
        })
    }
    return globalAxios;
}