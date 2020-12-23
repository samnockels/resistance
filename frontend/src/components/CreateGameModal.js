import React, { useEffect, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Input,
	useDisclosure,
	useToast,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Select,
	Radio,
	InputRightAddon,
	InputGroup,
	InputRightElement,
	IconButton,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons'

import { Formik, Form, Field, useFormikContext } from 'formik'
import { errorToastConfig, defaultGameConfig } from '../config'
import getRandomName from '../services/getRandomName'

async function createGame(gameConfig) {
	console.log(gameConfig)
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), 2000)
	})
}

function CreateGameModal() {
	const [gameConfig, setGameConfig] = useState({
		...defaultGameConfig,
		name: getRandomName()
	})
	const { isOpen, onOpen, onClose } = useDisclosure()

	const toast = useToast()

	const onError = () => {
		toast(errorToastConfig)
		onClose()
	}

	const onSubmit = (values, actions) => {
		createGame(values)
				.then(() => {
					actions.setSubmitting(false)
					onClose()
				})
				.catch(() => {
					actions.setSubmitting(false)
					onError()
				})			
	}

	const validateName = (name) => {
		if (!name) return 'Name is required'
		return undefined;
	}

	return (
		<>
			<Button onClick={onOpen}>New Game</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<Formik initialValues={gameConfig} onSubmit={onSubmit}> 
					{(props) => (
						<>
							<ModalOverlay />
							<ModalContent>
								<ModalHeader>Create Game</ModalHeader>
								<ModalCloseButton />
								<ModalBody>
									<Form>
										<Field name="name" validate={validateName}>
											{({ field, form }) => (
												<FormControl isInvalid={form.errors.name && form.touched.name}>
													<FormLabel htmlFor="name">Name</FormLabel>
													<InputGroup>
														<Input {...field} id="name" placeholder="Name"/>
														<InputRightElement>
															<IconButton icon={<RepeatIcon/>} onClick={()=>props.setFieldValue('name', getRandomName())}/>
														</InputRightElement>
													</InputGroup>
													<FormErrorMessage>{form.errors.name}</FormErrorMessage>
												</FormControl>
											)}
										</Field>
									</Form>
								</ModalBody>

								<ModalFooter>
									<Button variant="ghost" onClick={onClose} disabled={props.isSubmitting}>Cancel</Button>
									<Button colorScheme="blue" ml={3} isLoading={props.isSubmitting} onClick={() => props.submitForm()}>
										Create Game
									</Button>
								</ModalFooter>
							</ModalContent>
						</>
					)}
				</Formik>
			</Modal>
		</>
	)
}

export default CreateGameModal;