import React, { useContext, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Modal,
  Input
} from '@chakra-ui/react';
import CreateGameModal from './CreateGameModal';
import { ApiContext } from '../services/api'

function GamesList() {
	const [createGameModalOpen, setCreateGameModalOpen] = useState(false)
	const { getPlayers } = useContext(ApiContext)
	getPlayers().then(console.log)
  return (
    <VStack>
        <Table variant="simple">
            <Thead width='100%'>
                <Tr>
                    <Th colSpan={2}>
                        <HStack justifyContent='space-between'>
                            <span>Games</span>
                            <CreateGameModal />
                        </HStack>
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>abcdefg</Td>
                    <Td textAlign='right'>
                        <Button>Join</Button>
                    </Td>
                </Tr>
                <Tr height='400px'>
                    <Td colSpan={2} textAlign='center'>No Games 😢</Td>
                </Tr>
            </Tbody>
        </Table>
        
    </VStack>
  );
}

export default GamesList;
