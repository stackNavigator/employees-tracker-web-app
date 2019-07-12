import React, { Component } from 'react'

export class InputForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      isLoading: false,
      isAnimating: false,
      notAuthorized: false,
      isResolved: false,
      isRejected: false,
      isActive: true,
      surname: '',
      name: '',
      secondName: '',
      position: '',
      personnelName: ''
    }
  }

  handleAnimation = () => {
    if (this.state.notAuthorized)
      this.props.onSubmit(null)
    this.props.onCrudClick(this.props.crud)
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }

  handleRequestResult = status => {
    this.setState({ isActive: false })
    if (status === 'resolved')
      this.setState({ isLoading: false, isResolved: true })
    if (status === 'rejected')
      this.setState({ isLoading: false, isRejected: true, notAuthorized: true })
    setTimeout(() => {
      this.setState({ isAnimating: true })
    }, 1500)
  }

  validateInput = input => {
    const { name } = input
    const inputDOM = document.querySelector(`[name=${name}]`)
    const { validity, files = null } = inputDOM
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
      case !this.checkFileSize(files):
        inputDOM.setCustomValidity('Фото повинно важити менше ніж 3 Мб.')
        return false
      default:
        inputDOM.setCustomValidity('')
        return true
    }
  }

  checkFileSize = files => {
    if (files && files[0].size > 3 * 1024 * 1024) 
      return false
    return true
  }

  handleCancelClick = e => {
    e.preventDefault()
    this.setState({ isAnimating: true })
  }

  handleSubmit = () => {
    const validated = this.props.inputs.map(input => this.validateInput(input))
    this.props.method === 'POST' ? validated.push(this.validateInput({ name: 'profilePic' })) : ''
    const { files } = document.querySelector('[name=profilePic]')
    files.length ? validated.push(this.validateInput({ name: 'profilePic' })) : ''
    if (validated.includes(false))
      return
    this.setState({ isLoading: true, errorMessage: '' })
    const body = new FormData()
    for (let input of this.props.inputs) {
      const { name } = input
      this.state[name] ? body.append(name, this.state[name]) : ''
    }
    files.length ? body.append('profilePic', document.querySelector('[name=profilePic]').files[0]) : ''
    fetch(this.props.url, {
      method: this.props.method,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body
    })
    .then(res => {
      if (res.status === 401)
        throw 'Користувач не авторизований.'
      if (res.status === 500)
        throw res.json()
      return res.json()
    })
    .then(() => this.handleRequestResult('resolved'))
    .catch(err => err === 'Користувач не авторизований.' 
      ? this.handleRequestResult('rejected')
      : this.setState({ errorMessage: err.message, isLoading: false }))
  }

  render() {
    const inputs = this.props.inputs.map(input => {
      const { name, min, max, type, pattern, placeholder } = input
      return (
        <div key={name}>
          <div className="col s12">
            <div className="col s12 input-field">
              <input name={name} onChange={this.handleInputChange}
              value={this.state[name]} onInput={() => this.validateInput(input)}
              type={type} placeholder={placeholder} minLength={min}
              maxLength={max} pattern={pattern} required={this.props.method === 'POST'
              ? true : false} />
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className={this.state.isAnimating ? 'slide-out' : ''}
      onAnimationEnd={this.handleAnimation}>
        <h3 className="center-align">{this.props.text}</h3>
        <form className="row" onSubmit={e => e.preventDefault()}>
          <div className="col s12 file-field input-field">
            <div className="btn">
              <span>Фото</span>
              <input name="profilePic" type="file" required={this.props.method === 'POST' 
              ? true : false} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path" id="inputField" type="text" placeholder="Завантажте фото" />
            </div>
          </div>
          {inputs}
          {this.state.errorMessage
          ? 
          <div className="col s12 center-align err-message">
            <h5>{this.state.errorMessage}</h5>
          </div>
          : ''}
          {this.state.isLoading 
          ?
          <div className="col s12 center-align">
            {React.Children.toArray(this.props.children)[0]}
          </div>
          : ''}
          {this.state.isResolved
          ?
          <div className="col s12 center-align">
            <i className="material-icons resolve-tooltip">check</i>
          </div>
          : ''}
          {this.state.isRejected
          ?
          <div className="col s12 center-align">
            <i className="material-icons reject-tooltip">clear</i>
          </div>
          : ''}
          {this.state.isActive
          ?
          <div className="col s12 center-align">
            <div className="col s12 m6 center-align">
              <button className="btn-flat btn-edit" onClick={this.handleSubmit}>
                Підтвердити
              </button>
            </div>
            <div className="col s12 m6 center-align">
              <button className="btn-flat btn-delete" onClick={this.handleCancelClick}>
                Скасувати
              </button>
            </div>
          </div> 
          : ''}
        </form>
      </div>
    )
  }
}

InputForm.defaultProps = {
  inputs: [
    {
      name: 'surname',
      value: '',
      min: 2,
      max: 100,
      type: 'text',
      pattern: '^[А-ЩЬЮЯЇІЄҐ\'][а-щьюяїієґ\']+(-[А-ЩЬЮЯЇІЄҐ\'])*[а-щьюяїієґ\']*$',
      patternMsg: 'Дозволяються лише українські літери та символ "-".',
      placeholder: 'Введіть прізвище'
    },
    {
      name: 'name',
      value: '',
      min: 2,
      max: 100,
      type: 'text',
      pattern: '^[А-ЩЬЮЯЇІЄҐ\'][а-щьюяїієґ\']+(-[А-ЩЬЮЯЇІЄҐ\'])*[а-щьюяїієґ\']*$',
      patternMsg: 'Дозволяються лише українські літери та символ "-".',
      placeholder: `Введіть ім'я`
    },
    {
      name: 'secondName',
      value: '',
      min: 2,
      max: 100,
      type: 'text',
      pattern: '^[А-ЩЬЮЯЇІЄҐ\'][а-щьюяїієґ\']+(-[А-ЩЬЮЯЇІЄҐ\'])*-?[а-щьюяїієґ\']*$',
      patternMsg: 'Дозволяються лише українські літери та символ "-".',
      placeholder: 'Введіть по батькові'
    },
    {
      name: 'position',
      value: '',
      min: 2,
      max: 100,
      type: 'text',
      pattern: '^[А-ЩЬЮЯЇІЄҐ][а-щьюяїієґ0-9- ]+$',
      patternMsg: 'Дозволяються лише українські літери та цифри.',
      placeholder: 'Введіть посаду'
    },
    {
      name: 'personnelName',
      value: '',
      min: 1,
      max: 100,
      type: 'text',
      pattern: '^[0-9]+$',
      patternMsg: 'Дозволяються лише цифри.',
      placeholder: 'Введіть табельний номер'
    }
  ]
}