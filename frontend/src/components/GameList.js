import React, { useContext, useEffect, useState } from 'react';
import {
	VStack,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	HStack,
	Spinner,
	Badge} from '@chakra-ui/react';
import CreateGameModal from './CreateGameModal';
import { ApiContext } from '../services/api'
import { handleError } from '../utils'
import { AppContext } from '../App';

const REFRESH_GAMES_INTERVAL_MS = 5000 
const NUM_COLUMNS = 4

function GameStatus({ status }) {
	switch(status) {
		case 'not-started': return <Badge colorScheme='blue'>In Lobby</Badge>
		case 'in-game': return <Badge colorScheme='green'>In Game</Badge>
		case 'finished': return <Badge colorScheme='red'>Finished</Badge>
		default: return <Badge colorScheme='blue'>In Lobby</Badge>
	}
}

function GamesList({ join }) {
	const [games, setGames] = useState([])
	const [loading, setLoading] = useState(true)
	const { getGames, getPlayer } = useContext(ApiContext)
	const { player } = useContext(AppContext)

	const loadGames = async () => {
		try {
			const games = await getGames()
			for (let game of games) {
				game.creator = (await getPlayer(game.created_by)).name
			}
			setGames(games)
		} catch (error) {
			handleError()
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadGames()
		const timer = setInterval(loadGames, REFRESH_GAMES_INTERVAL_MS)
		return () => {
			clearInterval(timer)
		}
	}, [])

	const renderLoading = () => (
		<Tr>
			<Td colSpan={NUM_COLUMNS} textAlign='center'>
				<Spinner />
			</Td>
		</Tr>
	)

	return (
		<VStack justifyContent="center">
			<Table variant="simple"
				maxW="800px"
				border="1px solid #2d3848"
				borderRadius={10}>
				<Thead width='100%'>
					<Tr>
						<Th colSpan={NUM_COLUMNS}>
							<HStack justifyContent='space-between'>
								<span>Games</span>
								{player.isAdmin && <CreateGameModal afterCreate={() => loadGames()} />}
							</HStack>
						</Th>
					</Tr>
					<Tr>
						<Th>Lobby Name</Th>
						<Th>Game</Th>
						<Th>Status</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>
					{loading
						? renderLoading()
						: (
							games.length > 0
								? games.map(game => (
									<Tr key={game._id}>
										<Td>{game.name}</Td>
										<Td><Badge>Resistance</Badge></Td>
										<Td><GameStatus status={game.status}/></Td>
										<Td textAlign='right'>
											<Button 
												disabled={game.status !== 'not-started'}
												onClick={() => join(game)}>
												Join
											</Button>
										</Td>
									</Tr>
								))
								: (
									<Tr height='400px'>
										<Td colSpan={NUM_COLUMNS} textAlign='center'>No Games 😢</Td>
									</Tr>
								)
						)
					}
				</Tbody>
			</Table>

		</VStack>
	);
}

export default GamesList;
