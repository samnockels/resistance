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

// import io from 'socket.io-client';

// const socket = io('localhost:5000');
// socket.on('connect', function(){console.log('connect')});
// socket.on('disconnect', function(){console.log('disconnect')});
// window.socket = socket
// socket.onAny((eventName, ...args) => {
//   console.log('<-- ',eventName, ...args)
// });

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

  const navbar = () => {
    if (page === pages.LOADING || page === pages.ENTER || !page) {
      return null
    }
    return (
      <HStack
        position='absolute'
        height={70}
        top={0} left={0} right={0}
        padding='5px'
        justifyContent='space-between'
        bgColor='#1d2531'
      >
        <Button onClick={onLogout} mr={2}>
          <ArrowBackIcon />
        </Button>
        <HStack>
          {player.isAdmin ? <StarIcon color='gold' /> : ''}
          <Text ml={5}>{player.name}</Text>
        </HStack>
        <Avatar src={player.avatar} background='transparent' />
      </HStack>
    )
  }

  const ContainerWithNav = (props) => {
    return (
      <>
        {navbar()}
        <Box mt={105}>
          {props.children}
        </Box>
      </>
    )
  }

  return (
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
          <Route exact path="/games">
            <ContainerWithNav>
              <GamesList join={onJoin} />
            </ContainerWithNav>
          </Route>

          <Route exact path="/lobby">
            <ContainerWithNav>
            </ContainerWithNav>
              <GameLobby game={game} leave={onLeave} />
          </Route>
        </LoggedInContainer>

        <Route>
          404
        </Route>
      </Switch>
    </Box>
  );
}

export default App;
