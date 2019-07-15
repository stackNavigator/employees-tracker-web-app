import React, { Component } from 'react'

export class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: [
        {
          name: 'username',
          value: '',
          min: 2,
          max: 20,
          type: 'text',
          pattern: '^[a-zA-Z0-9]+_?[a-zA-Z0-9]+$',
          patternMsg: 'Дозволяються лише англійські літери, цифри та символ "_".',
          placeholder: 'Введіть логін'
        },
        {
          name: 'password',
          value: '',
          min: 8,
          max: 64,
          type: 'password',
          pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*',
          patternMsg: 'Необхідна щонайменше одна велика літера і цифра (англійські літери).',
          placeholder: 'Введіть пароль'
        }
      ],
      isLoading: false,
      isAnimating: false,
      isError: false,
      errorMessage: '',
      role: ''
    }
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState(prevState => ({
      inputs: prevState.inputs.map(input => (
        input.name === name
          ? { ...input, value }
          : input
      ))
    }))
  }

  validateInput = input => {
    const { name } = input
    const inputDOM = document.querySelector(`[name=${name}]`)
    const { validity } = inputDOM
    switch (true) {
      case validity.tooShort:
        const { min } = input
        inputDOM.setCustomValidity(`Мінімальна кількість символів: ${min}.`)
        return false
      case validity.valueMissing:
        inputDOM.setCustomValidity('Заповніть це поле.')
        return false
      case validity.patternMismatch:
        const { patternMsg } = input
        inputDOM.setCustomValidity(patternMsg)
        return false
      default:
        inputDOM.setCustomValidity('')
        return true
    }
  }

  toggleVisibility = () => {
    const input = document.querySelector('[name=password]')
    const { type } = input
    type === 'password'
    ? input.setAttribute('type', 'text')
    : input.setAttribute('type', 'password')
  }

  handleAnimation = () => {
    this.props.onSubmit(this.state.role)
  }

  handleSubmit = () => {
    const validated = this.state.inputs.map(input => this.validateInput(input))
    if (validated.includes(false))
      return
    this.setState({ isLoading: true, isError: false })
    const payload = this.state.inputs.reduce((acc, { name, value }) => ({ ...acc, [name]: value}), {})
    fetch(this.props.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.status === 404)
        throw 'Такого користувача не існує, спробуйте інший логін.'
      if (res.status === 401)
        throw 'Помилка входу, спробуйте інший логін та/або пароль.'
      if (res.status === 200)
        return res.json()
    })
    .then(({ role, token }) => {
      localStorage.setItem('token', token)
      this.setState({ role, isAnimating: true })
    })
    .catch(err => {
      this.setState({
        isError: true,
        errorMessage: err,
        isLoading: false
      })
    })
  }

  render() {
    const inputs = this.state.inputs.map(input => {
      const { name, value, min, max, type, pattern, placeholder } = input
      return (
        <div className="col s12" key={name}>
          <div className="col s12 input-field">
            <input name={name} onChange={this.handleInputChange}
            value={value} onInput={() => this.validateInput(input)}
            type={type} placeholder={placeholder} minLength={min}
            maxLength={max} pattern={pattern} required />
            {input.name === 'password'
            ? <i onClick={this.toggleVisibility}
              className="material-icons toggle-visibility">remove_red_eye</i>
            : ''}
          </div>
        </div>
      )
    })

    return (
      <div className={this.state.isAnimating ? 'slide-out' : ''} 
      onAnimationEnd={this.handleAnimation}>
        <h3 className="center-align">{this.props.text}</h3>
        <form className="row" onSubmit={e => e.preventDefault()}>
          {inputs}
          {this.state.isError
          ?
          <div className="col s12 center-align err-message">
            <h5>{this.state.errorMessage}</h5>
          </div>
          : '' }
          {this.state.isLoading 
          ?
          <div className="col s12 center-align">
            {React.Children.toArray(this.props.children)[0]}
          </div>
          : 
          <div className="col s12 center-align">
            <button className="btn-flat" onClick={this.handleSubmit}>
              Увійти до системи
              <i className="material-icons right">person</i>
            </button>
          </div> }
        </form>
      </div>
    )
  }
}