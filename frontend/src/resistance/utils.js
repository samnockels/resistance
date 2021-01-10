/**
 * Get player in the order we would like to display
 * (the first is the player after you, the last is the player before you)
 * @param {Array[Player]} players
 * @param {Number} me - the index of the logged in player
 */
export const getPlayersInOrder = (players, me) => {
    const playersAfter = players.slice(me + 1, players.length)
    const playersBefore = players.slice(0, me)
    return [...playersAfter, ...playersBefore]
}

/**
 * Splits array of players into two rows for displaying
 * @param {Array[Player]} players
 */
export const splitPlayersIntoRows = (players) => {
    const p = [...players]
    const rowA = p.splice(0, Math.ceil(p.length / 2))
    const rowB = p
    return [rowA, rowB]
}
