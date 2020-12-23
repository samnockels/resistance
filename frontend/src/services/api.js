import { createContext } from 'react'
import { axiosInstance } from './http'

const axios = axiosInstance()

async function login(password) {
    return await axios.post('/login', {
        body: {
            password
        }
    })
}

async function getPlayers() {
    const res = await axios.get('/players')
    return res.data
}

export const ApiContext = createContext()
export const ApiProvider = ApiContext.Provider
export const ApiConsumer = ApiContext.Consumer

export default {
    login,
    getPlayers
}