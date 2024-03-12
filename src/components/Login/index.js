import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', showErrorMsg: false, errorMsg: ''}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onLoginFailure = em => {
    this.setState({showErrorMsg: true, errorMsg: em})
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {method: 'POST', body: JSON.stringify(userDetails)}
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {userId, pin, showErrorMsg, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-container">
        <div className="content-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="image"
            />
          </div>
          <form className="form-element" onSubmit={this.BankLogin}>
            <h1 className="header">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="user" className="label">
                User ID
              </label>
              <input
                id="user"
                className="input"
                placeholder="Enter User ID"
                type="text"
                value={userId}
                onChange={this.onChangeUserId}
              />
            </div>

            <div className="inp-con">
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                id="pin"
                className="input"
                placeholder="Enter PIN"
                type="password"
                value={pin}
                onChange={this.onChangePin}
              />
            </div>
            <button className="button" type="submit">
              Login
            </button>
            <div className="error-message-container">
              {showErrorMsg === true && (
                <p className="error-message">{errorMsg}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
