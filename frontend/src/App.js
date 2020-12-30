import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect
} from "react-router-dom";
import {
  Text,
  Box,
  extendTheme,
  Spinner,
  Button,
  ScaleFade,
  Flex,
  Avatar,
  HStack,
  VStack,
  Container
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';

import GamesList from './components/GameList'
import GameLobby from './components/GameLobby'
import Enter from './components/Enter'
import { history } from './utils'
import { ApiContext } from './services/api';

import './services/socket'

const pages = {
  LOADING: '/loading',
  ADMIN: '/admin',
  ENTER: '/enter',
  GAMES: '/games',
  LOBBY: '/lobby'
}





function LoggedInContainer(props) {
  const { whoAmI } = useContext(ApiContext)
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    const isLoggedIn = await whoAmI()
    if (!isLoggedIn) {
      history.push('/enter')
    } else {
      setLoading(false)
    }
  }, [])

  return loading ? null : props.children
}

export const AppContext = React.createContext({
  player: null
})

function App(props) {
  const { whoAmI, logout } = useContext(ApiContext)
  const [player, setPlayer] = useState(false)
  const [game, setGame] = useState(false)
  let location = useLocation()
  const page = location.pathname

  console.log(page)

  const setPage = history.push

  const checkAuth = async () => {
    const player = await whoAmI()
    if (!player) {
      if ([pages.ADMIN, pages.ENTER].includes(page)) {
        return
      }
      return setPage(pages.ENTER)
    }
    setPlayer(player)
    if ([pages.ADMIN, pages.ENTER, pages.LOADING].includes(page)) {
      setPage(pages.GAMES)
    }
  }

  useEffect(checkAuth, [])

  const onJoin = async (game) => {
    setGame(game)
    setPage(pages.LOBBY)
  }

  const onLeave = async () => {
    setPage(pages.GAMES)
    setGame(false)
  }

  const onLogout = async () => {
    await logout()
    if (player.isAdmin) return setPage(pages.ADMIN)
    return setPage(pages.ENTER)
  }

  const ContainerWithNav = (props) => {
    return (
      <>
        <HStack
          width={'100%'}
          padding='5px 10px'
          justifyContent='space-between'
          bgColor='#1d2531'
        >
          <Button onClick={onLogout} mr={2} size='sm'>
            Logout
          </Button>
          <HStack>
            {player.isAdmin ? <StarIcon color='gold' /> : ''}
            <Text ml={5}>{player.name}</Text>
          </HStack>
          <Avatar src={player.avatar} background='transparent' />
        </HStack>
        <Box mt={50} mb={100}>
          {props.children}
        </Box>
      </>
    )
  }

  const getAppContext = () => {
    return {
      player
    }
  }

  return (
    <AppContext.Provider value={getAppContext()}>
      <Box minH='100vh' width='100%'>
        <Switch>
          <Route exact path="/admin">
            <Enter onEnter={checkAuth} isAdminLogin />
          </Route>

          <Route exact path="/enter">
            <Enter onEnter={checkAuth} />
          </Route>

          <Route exact path="/">
            <Redirect to="/enter" />
          </Route>

          <LoggedInContainer>
            <ContainerWithNav>
              <Route exact path="/games">
                <GamesList join={onJoin} />
              </Route>

              <Route exact path="/lobby">
                <GameLobby game={game} leave={onLeave} />
              </Route>
            </ContainerWithNav>
          </LoggedInContainer>

          <Route>
            404
        </Route>
        </Switch>
      </Box>
    </AppContext.Provider>
  );
}

function Lol() {
  return 'alice is cool'
}

export default Lol;
