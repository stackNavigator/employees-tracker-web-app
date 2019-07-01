import React, { Component } from 'react'

export class Employees extends Component {
  constructor() {
    super()
    this.state = {
      errorMessage: '',
      employee: null,
      isLoading: false,
      isAnimating: false
    }
  }

  handleAnimation = () => {
    this.setState({ isAnimating: false, isLoading: false })
    this.props.onSubmit(null)
  }

  handleLoading = field => {
    this.setState({ isLoading: true, errorMessage: '', employee: '' })
    fetch(`http://localhost:3502/api/employees?query=${field}`,
    {
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
      if (res.status === 200)
        return res.json()
    })
    .then(({ employee }) => {
      this.setState({ employee: employee[0], isLoading: false })
    })
    .catch(err => {
      err === 'Користувач не авторизований.'
      ? this.setState({ isAnimating: true })
      : this.setState({ errorMessage: err, isLoading: false })
    })
  }

  render() {
    const children = this.props.children.map((child, i) => i === 1
      ? React.cloneElement(child, { onLoading: this.handleLoading })
      : React.cloneElement(child))
    return (
      <div className={this.state.isAnimating ? 'row slide-out' : 'row'} 
      onAnimationEnd={this.handleAnimation}>
        {children[1]}
        {this.state.errorMessage
        ? 
        <div className="col s12 center-align errMessage">
          <h5>{this.state.errorMessage}</h5>
        </div>
        : ''}
        {this.state.isLoading
        ?
        <div className="col s12 center-align">
          {children[0]}
        </div>
        : ''}
        {this.state.employee
        ?
        <div>{this.state.employee._id}</div>
        : ''}
      </div>
    )
  }
}