import React from 'react'
import { Flex } from '@chakra-ui/react'

export const missionStyle = {
    notStarted: {
        bg: 'grey',
    },
    success: {
        bg: 'green.500',
    },
    fail: {
        bg: 'red.500',
    },
}

export function Mission({ mission, missionNo }) {
    return (
        <Flex
            w={150}
            h={150}
            mx={10}
            borderRadius={100}
            alignItems="center"
            justifyContent="center"
            {...missionStyle[mission.status]}
        >
            {missionNo}
        </Flex>
    )
}
