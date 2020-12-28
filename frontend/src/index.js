import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import api, { ApiProvider } from './services/api'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {
    Router,
} from "react-router-dom";
import { history } from './utils'

localStorage.setItem('chakra-ui-color-mode', 'dark')
const customTheme = extendTheme({
    initialColorMode: 'dark'
})

ReactDOM.render(
    <Router history={history}>
        <ChakraProvider theme={customTheme}>
            <ApiProvider value={api}>
                <App />
            </ApiProvider>
        </ChakraProvider>
    </Router>
    , document.getElementById("root"));