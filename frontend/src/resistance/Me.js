import React from 'react'
import { Box } from '@chakra-ui/react'
import { Player } from './Player'

export function Me({ player, isTurn }) {
    return (
        <Box py={20}>
            <Player player={player} width={300} height={360} isTurn={isTurn} />
        </Box>
    )
}
