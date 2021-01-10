import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { config } from './Resistance'

export const playerStyle = {
    spy: {
        bg: '#BF5E5E',
        border: '10px solid',
        borderColor: 'red.400',
    },
    resistance: {
        bg: 'blue.500',
        border: '10px solid',
        borderColor: 'blue.400',
    },
    unknown: {
        bg: 'gray.500',
        border: '10px solid',
        borderColor: 'gray.400',
    },
}

export const isTurnStyle = {
    // borderColor: 'white',
}

export const isCrewStyle = {
    borderColor: 'green.500',
}

export function Player({ player, width, height, isTurn, isCrew }) {
    return (
        <Box
            w={width}
            h={height}
            {...playerStyle[player.type || config().UNKNOWN_ROLE]}
            m="35px"
            {...(isTurn ? isTurnStyle : {})}
            {...(isCrew ? isCrewStyle : {})}
        >
            <Flex
                h={'100%'}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                {isTurn && <StarIcon />}
                {player.name}
            </Flex>
        </Box>
    )
}

Player.defaultProps = {
    width: 200,
    height: 240,
    isTurn: false,
    isCrew: false,
}

Player.propTypes = {
    player: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
}
