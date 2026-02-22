import { Component } from 'react'
import './index.css'
import { useNavigate, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const withRouter = WrappedComponent => {
    return props => {
        const navigate = useNavigate()
        return <WrappedComponent {...props} navigate={navigate} />
    }
}

class Login extends Component {
    state = {
        username: '',
        password: '',
        showSubmitError: false,
        errMsg: '',
    }

    handleUsernameChange = event => {
        this.setState({ username: event.target.value })
    }

    handlePasswordChange = event => {
        this.setState({ password: event.target.value })
    }

    onSubmitSuccess = jwtToken => {
        Cookies.set('jwt_token', jwtToken, { expires: 30 })
        const { navigate } = this.props
        navigate('/', { replace: true })
    }

    onSubmitFailure = errMsg => {
        this.setState({ showSubmitError: true, errMsg })
    }

    onSubmitForm = async event => {
        event.preventDefault()
        const { username, password } = this.state

        const userDetails = { username, password }

        const response = await fetch('https://apis.ccbp.in/login', {
            method: 'POST',
            body: JSON.stringify(userDetails),
        })

        const data = await response.json()

        if (response.ok === true) {
            this.onSubmitSuccess(data.jwt_token)
        } else {
            this.onSubmitFailure(data.error_msg)
        }
    }

    render() {
        const jwtToken = Cookies.get('jwt_token')

        // If already logged in, redirect
        if (jwtToken !== undefined) {
            return <Navigate to="/" replace />
        }

        const { username, password, showSubmitError, errMsg } = this.state

        return (
            <div className="login">
                <div className="login-container">
                    <img
                        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                        alt="website logo"
                        className="login-logo"
                    />

                    <form className="login-form" onSubmit={this.onSubmitForm}>
                        <label htmlFor="username" className="label">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            placeholder="Username"
                            className="input"
                            onChange={this.handleUsernameChange}
                            autoComplete="username"
                        />

                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Password"
                            className="input"
                            onChange={this.handlePasswordChange}
                            autoComplete="current-password"
                        />

                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>

                    {showSubmitError && (
                        <p className="error-message">*{errMsg}</p>
                    )}
                </div>
            </div>
        )
    }
}

export default withRouter(Login)