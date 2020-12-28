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
	Badge,
	propNames,
	TableCaption,
	Avatar
} from '@chakra-ui/react';
import CreateGameModal from './CreateGameModal';
import { ApiContext } from '../services/api'
import { handleError } from '../utils'

const REFRESH_PLAYERS_INTERVAL_MS = 5000
const NUM_COLUMNS = 2

function GameLobby({ game, leave }) {
	const [players, setPlayers] = useState([])
	const [loading, setLoading] = useState(true)
	const { getPlayers } = useContext(ApiContext)

	const loadPlayers = async () => {
		try {
			const players = await getPlayers()
			setPlayers(players)
		} catch (error) {
			handleError()
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadPlayers()
		const timer = setInterval(loadPlayers, REFRESH_PLAYERS_INTERVAL_MS)
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
				maxW="80vw"
				border="1px solid #2d3848"
				borderRadius={10}>
				<Thead width='100%'>
					<Tr>
						<Th colSpan={NUM_COLUMNS}>
							<HStack justifyContent='space-between'>
								<span>{game.game_name} Lobby</span>
								<Badge>Resistance</Badge>
							</HStack>
						</Th>
					</Tr>
					<Tr>
						<Th colSpan={2}>Player</Th>
					</Tr>
				</Thead>
				<Tbody>
					{loading
						? renderLoading()
						: (
							players.length > 0
								? players.map(player => (
									<Tr key={player._id}>
										<Td w={50} p={'15px'}>
											{<Avatar w={50} src={player.avatar} background='transparent' />}
										</Td>
										<Td>
											{player.name}
											{player.isAdmin ? '*' : ''}
											{game.created_by === player._id ? '%' : ''}
										</Td>
									</Tr>
								))
								: (
									<Tr height='400px'>
										<Td colSpan={NUM_COLUMNS} textAlign='center'>
											Lobby empty 😢
										</Td>
									</Tr>
								)
						)
					}
				</Tbody>
				<TableCaption>
					<Button onClick={() => leave()}>
						Leave Lobby
					</Button>
				</TableCaption>
			</Table>

		</VStack>
	);
}

export default GameLobby;
