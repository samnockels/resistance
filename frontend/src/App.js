import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  extendTheme
} from '@chakra-ui/react';
import GamesList from './components/GameList'
import api, { ApiProvider } from './services/api'

localStorage.setItem('chakra-ui-color-mode', 'dark')
const customTheme = extendTheme({
  initialColorMode: 'dark'
})

function App() {  
  return (
    <ChakraProvider theme={customTheme}>
      <ApiProvider value={api}>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <GamesList />
          </Grid>
        </Box>
      </ApiProvider>
    </ChakraProvider>
  );
}

export default App;
