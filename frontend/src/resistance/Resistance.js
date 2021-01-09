import React, { useContext, useEffect, useState } from 'react';
import {
	VStack,
	HStack,
	Center,
	Box,
    Flex,
    Spinner,
    Button,
    SlideFade,
    Fade,
    Text
} from '@chakra-ui/react';

const config = () => ({
    UNKNOWN_ROLE: 'resistance'
})

const players = [
    {
        _id: "8",
        name: "hhh",
    },
    {
        _id: "9",
        name: "iii",
    },
    {
        _id: "10",
        name: "jjj",
    },
    {
        _id: "2",
        name: "bbb",
    },
    {
        _id: "3",
        name: "ccc",
    },
    {
        _id: "4",
        name: "ddd",
    },
    {
        _id: "5",
        name: "eee",
    },
    {
        _id: "6",
        name: "fff",
    },
    {
        _id: "7",
        name: "ggg",
    }, 
    {
        _id: "1",
        name: "sam",
    },
]

const user = {
    _id: "1",
    name: "sam",
    isHost: true
}

const myIndex = () => {
    let me = false
    players.forEach((player, idx) => {
        if(player._id === user._id){
            me = idx
        }
    })
    if(me === false){
        throw new Error('...')
    }
    return me
}

const getPlayersInOrder = () => {
    const me = myIndex()
    const playersAfter = players.slice(me + 1, players.length)
    const playersBefore = players.slice(0, me)
    return [...playersAfter, ...playersBefore]
}

const splitPlayersIntoRows = (players) => {
    const p = [...players]
    const rowA = p.splice(0, Math.ceil(p.length/2))
    const rowB = p
    return [rowA, rowB]
}   

const missions = [
    {
        _id: "1",
        status: "notStarted",
    },
    {
        _id: "2",
        status: "notStarted",
    },
    {
        _id: "3",
        status: "notStarted",
    },
    {
        _id: "4",
        status: "notStarted",
    },
    {
        _id: "5",
        status: "notStarted",
    },
]

const playerStyle = {
    spy: {
        bg: "#BF5E5E", 
        border: "10px solid",
        borderColor: "red.400"
    },
    resistance: {
        bg: "blue.500", 
        border: "10px solid",
        borderColor: "blue.400"
    },
    unknown: {
        bg: "gray.500", 
        border: "10px solid",
        borderColor: "gray.400"
    }
}

const missionStyle = {
    notStarted: {
        bg: "grey", 
    },
    success: {
        bg: "green.500", 
    },
    fail: {
        bg: "red.500", 
    }
}

const isTurnStyle = {
    borderColor: 'white'
}

function Player({ player, width, height, isTurn }) {
    return (
        <Box w={width || 200} h={height || 240} {...playerStyle[player.type || config().UNKNOWN_ROLE]} m='35px' {...isTurn ? isTurnStyle:{}}>
            <Flex h={'100%'} alignItems='center' justifyContent="center">
                {player.name}
            </Flex>
        </Box>
    )
}

function Mission({ mission, missionNo }) {
    return (
        <Flex w={150} h={150} mx={10} borderRadius={100} alignItems='center' justifyContent="center" {...missionStyle[mission.status]}>
            {missionNo}
        </Flex>
    )
}

function Me({ player, isTurn }) {
    return (
        <Player player={player} width={300} height={360} isTurn={isTurn} />
    )
}

function CrewVote() {
    return (
        <HStack>
            <Flex bg="green.400" w={140} h={200}></Flex>
            <Flex bg="red.400" w={140} h={200}></Flex>
        </HStack>
    )
}

function PlayerGrid({ currentPlayer }) {
    const playersInOrder = getPlayersInOrder()
    if(playersInOrder.length > 5){
        const [rowA, rowB] = splitPlayersIntoRows(playersInOrder)
        return (
            <>
                <Flex justifyContent='center' flexWrap="wrap" maxW='100vw'>
                    {rowA.map((player, idx) => <Player player={player} isTurn={currentPlayer === idx} />)}
                </Flex>
                <Flex justifyContent='center' flexWrap="wrap" maxW='100vw'>
                    {rowB.map((player, idx) => <Player player={player} isTurn={currentPlayer === (idx + rowA.length)} />)}
                </Flex>
            </>
        )
    }
    return (
        <Flex justifyContent='center' flexWrap="wrap" maxW='100vw'>
            {playersInOrder.map(player => <Player player={player} />)}
        </Flex>
    )
}

function StartView({ players, me, currentPlayer, start, starting }){    
    return (
        <VStack h='100%' justifyContent='center'>
            <PlayerGrid players={players} currentPlayer={currentPlayer}/>
            <Box py={20}>
                <Me player={me} isTurn={myIndex() === currentPlayer} />
            </Box>
            {user.isHost && (
                <Button onClick={() => start()} isLoading={starting} size="lg" colorScheme="blue" py={10} px={20}>
                    START
                </Button>
            )}
        </VStack>
    )
}

function GameView({ players, me, currentPlayer }){    
    return (
        <VStack h='100%' justifyContent='center'>
            <PlayerGrid players={players} currentPlayer={currentPlayer}/>
            <Box py={20}>
                <Me player={me} isTurn={myIndex() === currentPlayer} />
            </Box>
            <HStack h={150}>
                {missions.map((mission, idx) => <Mission mission={mission} missionNo={idx + 1} />)}
            </HStack>
        </VStack>
    )
}


function CrewVoteView({ players, me, currentPlayer }){    
    return (
        <VStack h='100%' justifyContent='center'>
            <PlayerGrid players={players} currentPlayer={currentPlayer}/>
            <HStack>
                <Box py={20} pr={'200px'}>
                    <Me player={me} isTurn={myIndex() === currentPlayer} />
                </Box>
                <CrewVote />
            </HStack>
            <HStack h={150}>
                {missions.map((mission, idx) => <Mission mission={mission} missionNo={idx + 1} />)}
            </HStack>
        </VStack>
    )
}

function RevealRolesView({ players, me, onRolesRevealed }){
    const [roles, setRoles] = useState(false)    
    function revealRoles() {
        const roles = {
            role: Math.round(Math.random()) ? 'resistance' : 'spy',
            otherSpies: [
                '2',
                '9'
            ]
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(roles), 2000)
        })
    }

    useEffect(async () => {
        const roles = await revealRoles()
        setRoles(roles)
        onRolesRevealed(roles)
    }, [])

    if (roles){
        me.type = roles.role
    }

    return (
        <VStack h='100%' justifyContent='center'>
            <SlideFade in={roles} offsetY="250px" unmountOnExit={true}>
                <VStack>
                    <HStack justifyContent='center'>
                        <Me player={me}/>
                        <Flex maxW="600px" flexWrap="wrap" justifyContent="center">
                            {roles.role === 'spy' && roles.otherSpies && roles.otherSpies.map(spy => (
                                <Player player={{
                                    ...players.find(p => p._id === spy),
                                    type: 'spy'
                                }} />
                                ))}
                        </Flex>
                    </HStack>
                    {roles && (
                        <Text fontSize="4xl" pt={100} color={playerStyle[roles.role].borderColor}>
                            {roles.role === 'spy' ? 'You are a Spy 🕵️' : 'You are the Resistance'}
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

const View = {
    START: 'start',
    REVEAL_ROLES: 'reveal_roles',
    GAME: 'game',
    CREW_VOTE: 'crew_vote',
    REVEAL_ROLES: 'reveal_roles',
    REVEAL_ROLES: 'reveal_roles',
    REVEAL_ROLES: 'reveal_roles',
    REVEAL_ROLES: 'reveal_roles',
}

function Resistance() {
    const [view, _setView] = useState(View.START)
    const [starting, setStarting] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(0)

    const otherPlayers = players.filter(p => p._id !== user._id)
    const me = players.find(p => p._id === user._id)
    const common = {
        players: otherPlayers, 
        me,
        currentPlayer
    }

    const setView = (newView, timeout) => {
        _setView(false)
        setTimeout(() => {
            _setView(newView)
        }, 500)
    }

    function start() {
        setStarting(true)
        setTimeout(() => {
            setStarting(false)
            setView(View.REVEAL_ROLES)
        }, 1000)
    }

    function nextTurn() {
        const next = currentPlayer + 1
        if(next >= players.length){
            setCurrentPlayer(0)
        }else{
            setCurrentPlayer(next)
        }
    }

    function onRolesRevealed(roles) {
        if(roles.role === 'spy' && roles.otherSpies) {
            otherPlayers.forEach(player => {
                if(roles.otherSpies.includes(player._id)) {
                    player.type = 'spy'
                }
            })
        }
        setTimeout(() => setView(View.GAME), 5000)
    }

    function onCrewSelect() {
        setView(View.CREW_VOTE)
    }

	return (
		<Center pos='absolute' top={0} left={0} bottom={0} right={0}>
            <Fade in={view === View.START} unmountOnExit>
                <StartView {...common} start={start} starting={starting} />
            </Fade>
            <Fade in={view === View.REVEAL_ROLES} unmountOnExit>
                <RevealRolesView {...common} onRolesRevealed={(roles) => onRolesRevealed(roles)}/>
            </Fade>
            <Fade in={view === View.GAME} unmountOnExit>
                <GameView {...common} />
            </Fade>
            <Fade in={view === View.CREW_VOTE} unmountOnExit>
                <CrewVoteView {...common} />
            </Fade>
            <Button pos='absolute' bottom={0} left={0} onClick={() => onCrewSelect()}>
                Crew Vote
            </Button>
            
		</Center>
	);
}

export default Resistance;
