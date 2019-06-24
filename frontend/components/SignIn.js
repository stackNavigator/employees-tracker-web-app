import React, { Component } from 'react'

export class SignIn extends Component {
  constructor() {
    super()
    this.state = {
      text: 'Вхід до системи',
      inputs: [
        {
          name: 'username',
          value: '',
          min: 2,
          max: 20,
          pattern: '^[a-zA-Z0-9]+_?[a-zA-Z0-9]+$',
          patternMsg: 'Дозволяються лише англійські літери, цифри та символ "_".',
          placeholder: 'Введіть логін'
        },
        {
          name: 'password',
          value: '',
          min: 8,
          max: 64,
          pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*',
          patternMsg: 'Необхідна щонайменше одна велика літера і цифра (англійські літери).',
          placeholder: 'Введіть пароль'
        }
      ]
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

  handleSubmit = () => {
    const validated = this.state.inputs.map(input => this.validateInput(input))
    if (!validated.includes(false))
      console.log('submitted')
    
  }

  render() {
    const inputs = this.state.inputs.map(input => {
      const { name, value, min, max, pattern, placeholder } = input
      return (
        <div className="col s12" key={name}>
          <div className="col s12 input-field" key={name}>
            <input key={name} name={name} onChange={this.handleInputChange}
            value={value} onInput={() => this.validateInput(input)}
            type="text" placeholder={placeholder} minLength={min}
            maxLength={max} pattern={pattern} required />
          </div>
        </div>
      )
    })

    return (
      <div>
        <h3 className="center-align">{this.state.text}</h3>
        <form className="row" onSubmit={e => e.preventDefault()}>
          {inputs}
          <div className="col s12 center-align">
          <button className="btn-flat" onClick={this.handleSubmit}>
            Увійти до системи
            <i className="material-icons right">assignment</i>
          </button>
        </div>
        </form>
      </div>
    )
  }
}