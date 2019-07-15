import React, { Component } from 'react'

export class SearchField extends Component {
  constructor() {
    super()
    this.state = {
      searchField: '',
      searchTimeout: '',
      errorMessage: '',
      isLoading: false,
      isRejected: false
    }
  }

  validateInput = name => {
    const input = document.querySelector(`[name=${name}]`)
    const { validity } = input
    switch (true) {
      case validity.tooShort:
        return false
      case validity.valueMissing:
        return false
      default:
        return true
    }
  }

  handleRequestResult = () => {
    this.setState({ isLoading: false, isRejected: true })
    setTimeout(() => {
      this.props.triggerAnimation()
    }, 1500)
  }

  handleDelayedSearch = ({ target: { name } }) => {
    if (this.state.searchTimeout)
      clearTimeout(this.state.searchTimeout)
    if (this.validateInput(name))
      this.setState({
        searchTimeout: setTimeout(() => {
          this.handleLoading(this.props.searchField)
        }, 1000)
      })
  }

  handleLoading = field => {
    this.setState({ isLoading: true, errorMessage: '' })
    this.props.setEmployees([])
    fetch(`${this.props.url}?query=${field}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    })
    .then(res => {
      if (res.status === 404)
        throw 'Працівника не знайдено.'
      if (res.status === 401)
        throw 'Користувач не авторизований.'
      if (res.status === 500)
        throw res.json()
      if (res.status === 200)
        return res.json()
    })
    .then(({ employee }) => {
      this.setState({ isLoading: false })
      this.props.setEmployees(employee)
    })
    .catch(err => {
      switch (err) {
        case 'Користувач не авторизований.':
          return this.handleRequestResult()
        case 'Працівника не знайдено.':
          return this.setState({ errorMessage: err, isLoading: false })
        default:
          return this.setState({ errorMessage: err.message, isLoading: false })
      }
    })
  }

  render() {
    return (
      <div className="col s12">
        <div className="col s12 input-field">
          <i className="material-icons prefix">search</i>
          <input name="searchField" onChange={this.props.onInputChange}
          value={this.props.searchField} onInput={this.handleDelayedSearch} type="text" 
          placeholder="Введіть табельний номер або прізвище" minLength="1"
          maxLength="64" required />
        </div>
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
        {this.state.isRejected
        ?
        <div className="col s12 center-align">
          <i className="material-icons reject-tooltip">clear</i>
        </div>
        : ''}
      </div>
    )
  }
}