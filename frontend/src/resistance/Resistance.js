import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    HStack,
    Center,
    Flex,
    Spinner,
    Button,
    Fade,
    useEditable,
} from '@chakra-ui/react'
import { MainView } from './MainView'
import { StartView } from './StartView'
import { Me } from './Me'
import { Mission } from './Mission'
import { RevealRolesView } from './RevealRolesView'

// load stubs
async function loadStub(data) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000)
    })
}
const loadPlayers = () => {
    const p = loadStub(require('./data').players)
    return p.filter((p) => p._id !== user._id).sort((a, b) => a.turn - b.turn)
}
const loadUser = () => loadStub(require('./data').user)
const loadMissions = () => loadStub(require('./data').missions)

export const GameContext = createContext({
    loading: true,
    me: false,
    players: [],
    currentPlayer: false,
})

export const config = () => ({
    UNKNOWN_ROLE: 'resistance',
    REVEAL_ROLE_WAIT_TIME: 2000, // time to wait before revealing role (ms)
    REVEAL_ROLE_VIEW_TIME: 2000, // how long to show the role for (ms)
    REVEAL_ROLE_SPY_TEXT: 'You are a Spy 🕵️',
    REVEAL_ROLE_RESISTANCE_TEXT: 'You are the Resistance ✊',
})

const View = {
    START: 'start',
    REVEAL_ROLES: 'reveal_roles',
    GAME: 'game',
    CREW_VOTE: 'crew_vote',
}

function Resistance() {
    // view stuff
    const [view, _setView] = useState(View.GAME)
    const [loading, setLoading] = useState(true)
    const [starting, setStarting] = useState(false)
    // game stuff
    const [me, setMe] = useState(false)
    const [players, setPlayers] = useState(false)
    const [missions, setMissions] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(0)
    const [crew, setCrew] = useState([])

    useEffect(async () => {
        const [user, players, missions] = await Promise.all([
            loadUser(),
            loadPlayers(),
            loadMissions(),
        ])
        setMe(user)
        setPlayers(players)
        setMissions(missions)
        setLoading(false)
    }, [])

    const gameContext = {
        loading,
        me,
        players,
        currentPlayer,
    }

    const setView = (newView, timeout) => {
        _setView(false)
        setTimeout(() => _setView(newView), 500)
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
        if (next >= players.length) {
            setCurrentPlayer(0)
        } else {
            setCurrentPlayer(next)
        }
    }

    function onRolesRevealed(roles) {
        if (roles.role === 'spy' && roles.otherSpies) {
            players.forEach((player) => {
                if (roles.otherSpies.includes(player._id)) {
                    player.type = 'spy'
                }
            })
        }
        setTimeout(() => setView(View.GAME), 5000)
    }

    function onCrewSelect() {
        const crew = ['4', '7']
        setView(View.CREW_VOTE)
        setCrew(crew)
    }

    if (loading) {
        return 'loading....'
    }

    return (
        <GameContext.Provider value={gameContext}>
            <Center pos="absolute" top={0} left={0} bottom={0} right={0}>
                <Fade in={view === View.START} unmountOnExit>
                    <StartView start={start} starting={starting} />
                </Fade>
                <Fade in={view === View.REVEAL_ROLES} unmountOnExit>
                    <RevealRolesView
                        onRolesRevealed={(roles) => onRolesRevealed(roles)}
                    />
                </Fade>
                <Fade in={view === View.GAME} unmountOnExit>
                    <MainView players={players} currentPlayer={currentPlayer}>
                        <HStack>
                            <Me
                                player={me}
                                isTurn={me.turn === currentPlayer}
                            />
                            {/* {crewVote && (
                            <HStack>
                                <Flex bg="green.400" w={140} h={200}></Flex>
                                <Flex bg="red.400" w={140} h={200}></Flex>
                            </HStack>
                        )} */}
                        </HStack>
                        <HStack h={150}>
                            {missions.map((mission, idx) => (
                                <Mission
                                    mission={mission}
                                    missionNo={idx + 1}
                                />
                            ))}
                        </HStack>
                    </MainView>
                </Fade>
                <Button
                    pos="absolute"
                    bottom={0}
                    left={0}
                    onClick={() => onCrewSelect()}
                >
                    Crew Vote
                </Button>
            </Center>
        </GameContext.Provider>
    )
}

export default Resistance
