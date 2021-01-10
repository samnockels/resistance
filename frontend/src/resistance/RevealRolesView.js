import React, { useEffect, useState } from 'react'
import { VStack, HStack, Box, Flex, SlideFade, Text } from '@chakra-ui/react'
import { Me } from './Me'
import { Player } from './Player'
import { config } from './Resistance'

export function RevealRolesView({ players, me, roles, onRolesRevealed }) {
    const [showRole, setShowRole] = useState(false)

    useEffect(async () => {
        setTimeout(() => {
            setShowRole(true)
            onRolesRevealed(roles)
        }, config().REVEAL_ROLE_WAIT_TIME)
    }, [])

    const getSpy = (playerId) => {
        const spy = players.find((p) => p._id === spy)
        spy.type = 'spy'
        return spy
    }

    if (roles) {
        me.type = roles.role
    }

    return (
        <VStack h="100%" justifyContent="center">
            <SlideFade in={roles} offsetY="250px" unmountOnExit={true}>
                <VStack>
                    <HStack justifyContent="center">
                        <Me player={me} />
                        <Flex
                            maxW="600px"
                            flexWrap="wrap"
                            justifyContent="center"
                        >
                            {roles.role === 'spy' &&
                                roles.otherSpies &&
                                roles.otherSpies.map((playerId) => (
                                    <Player player={getSpy(playerId)} />
                                ))}
                        </Flex>
                    </HStack>
                    {roles && (
                        <Text fontSize="4xl" pt={100}>
                            {roles.role === 'spy'
                                ? config().REVEAL_ROLE_SPY_TEXT
                                : config().REVEAL_ROLE_RESISTANCE_TEXT}
                        </Text>
                    )}
                </VStack>
            </SlideFade>
            {!roles && (
                <Box>
                    <Text fontSize="4xl">Shhhhh....</Text>
                </Box>
            )}
        </VStack>
    )
}
