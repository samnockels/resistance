import React from 'react'
import { Flex } from '@chakra-ui/react'
import { getPlayersInOrder, splitPlayersIntoRows } from './utils'
import { Player } from './Player'

export function PlayerGrid({ currentPlayer, crew }) {
    const playersInOrder = getPlayersInOrder()
    const isCrew = (player) => {
        if (!crew) return false
        return crew.some((c) => c === player._id)
    }
    if (playersInOrder.length > 5) {
        const [rowA, rowB] = splitPlayersIntoRows(playersInOrder)
        return (
            <>
                <Flex justifyContent="center" flexWrap="wrap" maxW="100vw">
                    {rowA.map((player, idx) => (
                        <Player
                            player={player}
                            isTurn={currentPlayer === idx}
                            isCrew={isCrew(player)}
                        />
                    ))}
                </Flex>
                <Flex justifyContent="center" flexWrap="wrap" maxW="100vw">
                    {rowB.map((player, idx) => (
                        <Player
                            player={player}
                            isTurn={currentPlayer === idx + rowA.length}
                            isCrew={isCrew(player)}
                        />
                    ))}
                </Flex>
            </>
        )
    }
    return (
        <Flex justifyContent="center" flexWrap="wrap" maxW="100vw">
            {playersInOrder.map((player) => (
                <Player player={player} isCrew={isCrew(player)} />
            ))}
        </Flex>
    )
}
