import React, { useContext, useState } from 'react';
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
	FormControl,
	FormLabel,
	FormErrorMessage,
	InputGroup,
	InputRightElement,
	IconButton,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons'
import { Formik, Form, Field } from 'formik'
import { GameModel } from '../config'
import getRandomName from '../services/getRandomName'
import { ApiContext } from '../services/api';

function CreateGameModal(props) {
	const { createGame } = useContext(ApiContext)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [gameConfig] = useState({
		...GameModel,
		name: getRandomName()
	})
	
	const onSubmit = async (values, actions) => {
		try {
			await createGame(values)
			props.afterCreate()
		} catch (e) {
			onClose()
		} finally {
			actions.setSubmitting(false)
			onClose()
		}
	}

	const validateName = (name) => {
		if (!name) return 'Name is required'
		return undefined;
	}

	return (
		<>
			<Button onClick={onOpen} colorScheme="blue">New Game</Button>
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