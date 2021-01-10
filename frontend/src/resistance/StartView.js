import { Button } from '@chakra-ui/react'
import { Me } from './Me'
import { MainView } from './MainView'
import { GameContext } from './Resistance'
import { useContext } from 'react'

export function StartView({ players, me, currentPlayer, start, starting }) {
    const { currentPlayer } = useContext(GameContext)
    return (
        <MainView players={players} currentPlayer={currentPlayer}>
            <Me player={me} isTurn={me.turn === currentPlayer} />
            {user.isHost && (
                <Button
                    onClick={() => start()}
                    isLoading={starting}
                    size="lg"
                    colorScheme="blue"
                    py={10}
                    px={20}
                >
                    START
                </Button>
            )}
        </MainView>
    )
}
