import React, { Component } from 'react'

export class SearchField extends Component {
  constructor() {
    super()
    this.state = {
      searchField: '',
      isError: false,
      errorMessage: '',
      isPresent: false,
      searchTimeout: ''
    }
  }

  handleInputChange = ({ target: { name, value }}) => {
    this.setState({ [name]: value })
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

  handleDelayedSearch = ({ target: { name } }) => {
    if (this.state.searchTimeout)
      clearTimeout(this.state.searchTimeout)
    if (this.validateInput(name))
      this.setState({
        searchTimeout: setTimeout(() => {
          console.log(this.state.searchField)
        }, 1000)
      })
  }

  render() {
    return (
      <div className="col s12">
        <div className="col s12 input-field">
          <i className="material-icons prefix">search</i>
          <input name="searchField" onChange={this.handleInputChange}
          value={this.state.searchField} onInput={this.handleDelayedSearch} type="text" 
          placeholder="Введіть табельний номер або прізвище" minLength="1"
          maxLength="64" required />
        </div>
        {this.state.isError 
        ? 
        <div className="col s12 center-align errMessage">
          <h5>{this.state.errorMessage}</h5>
        </div>
        : ''}
        {this.state.isPresent
        ?
        <div></div>
        : ''}
      </div>
    )
  }
}