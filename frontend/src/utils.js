
import { createStandaloneToast } from "@chakra-ui/react"
import { errorToastConfig } from './config'
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export function handleErrorResponse(error) {
    const toast = createStandaloneToast()
    if(error && error.message){
        toast({
            ...errorToastConfig,
            title: error.message
        })
        throw new Error(error.message)
    }else{
        toast(errorToastConfig)
        throw new Error(errorToastConfig.title)
    }
}

export function handleError(error) {
    const toast = createStandaloneToast()
    if(error && error.message){
        toast({
            ...errorToastConfig,
            description: error.message
        })
    }else{
        toast(errorToastConfig)
    }
}

export function toast(status, title, description) {
    const toast = createStandaloneToast()
    toast({
        title,
        status,
        description,
    })
}