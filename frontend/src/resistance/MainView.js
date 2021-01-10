import React from 'react'
import { VStack } from '@chakra-ui/react'
import { PlayerGrid } from './PlayerGrid'

export function MainView({ players, currentPlayer, children }) {
    return (
        <VStack h="100%" justifyContent="center">
            <PlayerGrid players={players} currentPlayer={currentPlayer} />
            {children}
        </VStack>
    )
}
