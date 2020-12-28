import React, { useContext, useState } from 'react';
import {
	VStack,
	InputRightElement,
	Input,
	InputGroup,
	Spinner,
	Button,
	useToast,
	Avatar,
	HStack,
	Menu,
	MenuButton,
	MenuList,
	MenuOptionGroup,
	MenuItemOption,
	Center,
	Box,
} from '@chakra-ui/react';
import { ArrowForwardIcon, CheckIcon, CloseIcon, RepeatIcon, SettingsIcon } from '@chakra-ui/icons'
import { ApiContext } from '../services/api'
import { handleError } from '../utils';

function getAvatarUrl(seed = 'abc', type = 'bottts') {
	return `https://avatars.dicebear.com/4.5/api/${type}/${seed}.svg?w=100&h=100`
}

function random() {
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 32)
}

function Enter({ onEnter, isAdminLogin }) {
	const [loading, setLoading] = useState(false)
	const [entering, setEntering] = useState(false)
	const [available, setAvailable] = useState(null)
	const [avatar, setAvatar] = useState(getAvatarUrl(random()))
	const [avatarLoading, setAvatarLoading] = useState(false)
	const [avatarType, setAvatarType] = useState('bottts')
	const [name, setName] = useState('')

	// only if isAdminLogin is true
	const passwordRef = React.createRef()
	const getPassword = () => passwordRef.current.value

	const { nameIsAvailable, enterPlayer, enterAdmin } = useContext(ApiContext)
	const toast = useToast()

	const onChange = async (e) => {
		const name = e.target.value
		setName(name)
		if (name.length < 3) {
			setAvailable(false)
		}
		setLoading(true)
		setAvailable(await nameIsAvailable(name))
		const t = setTimeout(() => {
			setLoading(false)
			clearTimeout(t)
		}, 500)
	}

	const enter = async () => {
		setEntering(true)
		try {
			if (isAdminLogin) {
				console.log('enterAdmin', name, getPassword())
				await enterAdmin(name, avatar, getPassword())
			} else {
				await enterPlayer(name, avatar)
			}
			toast({ title: `Welcome, ${name}` })
			onEnter()
		} catch (e) {
			// ignore as already handled
		} finally {
			setEntering(false)
		}
	}

	const getBorderColour = () => {
		if (loading) return undefined
		if (available === true) return 'green.500'
		if (available === false) return 'red.500'
		return undefined
	}

	const renderIcon = () => {
		if (loading) return <Spinner thickness="2px" speed="0.3s" size="sm" />
		if (available === true) return <CheckIcon color="green.500" />
		if (available === false) return <CloseIcon color="red.500" />
		return null;
	}

	const updateAvatar = () => {
		const seed = random()
		setAvatarLoading(true)
		setAvatar(getAvatarUrl(seed, avatarType))
	}

	return (
		<Center pos='absolute' top={0} left={0} bottom={0} right={0}>
			<VStack maxW='50vw' w='100%' justifyContent="center" alignItem='center'>
				<Center w={100} h={100}>
					{avatarLoading ? <Spinner speed={'0.25s'}/> : ''}
					<Avatar display={avatarLoading ? 'none' : 'block'} w={100} h={100} background='transparent' src={avatar} onLoad={() => setAvatarLoading(false)} />
				</Center>
				<InputGroup maxW='500px' size='lg'>
					<Input
						value={name}
						placeholder="Enter your player name..."
						onChange={onChange}
						focusBorderColor={getBorderColour()}
						errorBorderColor={getBorderColour()}
						isInvalid={available === false} />
					<InputRightElement children={renderIcon()} />
				</InputGroup>
				{isAdminLogin && (
					<InputGroup maxW='500px' size='lg'>
						<Input
							type="password"
							ref={passwordRef}
							placeholder="Password" />
					</InputGroup>
				)}
				<HStack>
					<Menu closeOnSelect={false}>
						<MenuButton as={Button} >
							<SettingsIcon />
						</MenuButton>
						<MenuList minWidth="240px">
							<MenuOptionGroup value={avatarType} onChange={setAvatarType} type="radio">
								<MenuItemOption value="avataaars">Avataaars</MenuItemOption>
								<MenuItemOption value="bottts">Bottts</MenuItemOption>
								<MenuItemOption value="human">Human</MenuItemOption>
								<MenuItemOption value="male">Male</MenuItemOption>
								<MenuItemOption value="female">Female</MenuItemOption>
								<MenuItemOption value="gridy">Gridy</MenuItemOption>
								<MenuItemOption value="identicon">Identicon</MenuItemOption>
								<MenuItemOption value="jdenticon">Jdenticon</MenuItemOption>
							</MenuOptionGroup>
						</MenuList>
					</Menu>
					<Button onClick={updateAvatar}><RepeatIcon /></Button>
					<Button disabled={loading || !available} onClick={enter} isLoading={entering}>
						Enter <ArrowForwardIcon ml={2} />
					</Button>
				</HStack>
			</VStack>
		</Center>
	);
}

export default Enter;
