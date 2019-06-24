import React, { Component } from 'react'

export class SignIn extends Component {
  constructor() {
    super()
    this.state = {
      text: 'Вхід до системи',
      username: '',
      password: ''
    }
  }

  handleInputChange = ({ target: { name, value}}) => {

  }

  render() {

    return (
      <div>
        <h3 className="center-align">{this.state.text}</h3>
        <form className="row">
          <div className="col s12">
            <div className="col s12 input-field">
              <input
              name="login"
              onChange={this.handleInputChange}
              value={this.state.login}
              onKeyDown={this.handleKeyDown}
              type="text"
              placeholder="Введіть логін"
              min="2"
              maxLength="20"
              required />
            </div>
          </div>
          <div className="col s12">
            <div className="col s12 input-field">
              <input
              name="password"
              onChange={this.handleInputChange}
              value={this.state.password}
              onKeyDown={this.handleKeyDown}
              type="text"
              placeholder="Введіть пароль"
              min="2"
              maxLength="20"
              required />
            </div>
          </div>
        </form>
      </div>
    )
  }
}