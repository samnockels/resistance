import { createRef, useState } from 'react'
import PropTypes from 'prop-types';
import { login } from '../services/api'

function GameMasterAuth(props) {
	const { onLogin } = props
	const passwordRef = createRef()
	const [submitted, setSubmitted] = useState(false)
	const [result, setResult] = useState(false)

	const onSubmit = (e) => {
		e.preventDefault()
		console.log('Login', passwordRef.current.value)
		login(passwordRef.current.value)
			.then(res => {
				if (res.data.success) {
					if (typeof onLogin === 'function') 
						onLogin()
				}else {
					console.log('error')
				}
			})
	}
  return (
    <form onSubmit={onSubmit}>
			<input ref={passwordRef} type="password"/>
		</form>
  );
}

GameMasterAuth.propTypes = {
	onLogin: PropTypes.func.isRequired
}

export default GameMasterAuth;
