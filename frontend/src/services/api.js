import { createContext } from 'react'
import { errorToastConfig } from '../config'
import { handleError, handleErrorResponse, history, toast } from '../utils'
import { axiosInstance } from './http'

const axios = axiosInstance()

/**
 * 
 */

function getGameStatus(status){
    if (status === 0) return 'not-started'
    if (status === 1) return 'in-game'
    if (status === 2) return 'finished'
    return 'not-started'
}

const formatGame = game => {
    return {
        ...game,
        status: getGameStatus(game.status)
    }
}

async function enterPlayer(name, avatar, opts = {}) {
    const player = await whoAmI()
    if (player) {
        toast('error', `You are already logged in as ~${player.name}~`)
        throw new Error()
    }
    const body = {
        name, avatar
    }
    if (opts && opts.adminPassword) {
        body.adminPassword = opts.adminPassword
    }
    const res = await axios.post(`/enter`, body)
    if(res.data.error) handleErrorResponse(res.data.error)
    sessionStorage.setItem('token', res.data.token)
    return res.data
}

async function enterAdmin(name, avatar, password){
    const data = await enterPlayer(name, avatar, { 
        adminPassword: password
    })
    // if we get to here, the login was successful
    history.push('/')
    return data
}

async function logout() {
    const res = await axios.get(`/logout`)
    if (res.data.error) handleErrorResponse(res.data.error)
    toast('info', res.data.message)
    sessionStorage.removeItem('token')
}

async function whoAmI() {
    const res = await axios.get(`/whoami`)
    if(res.data.error) return false
    return res.data.me
}

async function isAdmin() {
    return (await whoAmI() || {}).isAdmin === true
}

async function nameIsAvailable(name) {
    const res = await axios.get(`/check_name/${name}`)
    if (res.data.error) return false
    return res.data.available
}

async function getPlayers() {
    const res = await axios.get('/players')
    if (res.data.error) handleErrorResponse(res.data.error)
    return res.data
}

async function getPlayer(id) {
    const res = await axios.get(`/players/${id}`)
    if (res.data.error) handleErrorResponse(res.data.error)
    return res.data
}

async function getGames() {
    const res = await axios.get('/list_games')
    if (res.data.error) handleErrorResponse(res.data.error)
    return res.data.map(formatGame)
}

async function createGame(name, game) {
    const res = await axios.post(`/game/create`,{
        name,
        game
    })
    if(res.data.error) handleErrorResponse(res.data.error)
    return res.data
}

async function joinGame(name, game) {
    const res = await axios.post(`/game/join`,{
        name,
        game
    })
    if(res.data.error) handleErrorResponse(res.data.error)
    return res.data
}

export const ApiContext = createContext()
export const ApiProvider = ApiContext.Provider
export const ApiConsumer = ApiContext.Consumer
 
export default {
    whoAmI,
    isAdmin,
    nameIsAvailable,
    enterPlayer,
    enterAdmin,
    logout,
    getPlayers,
    getPlayer,
    getGames,
    createGame,
    joinGame
}