import React, { Component } from 'react'

export class Switcher extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isAdding: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch(`http://localhost:3502/api/check-access`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200)
        return res.json()
      throw new Error()
    })
    .then(({ role }) => {
      this.setState({ role, isLoading: false })
    })
    .catch(() => {
      localStorage.removeItem('token')
      this.setState({
        role: null,
        isLoading: false
      })
    })
  }

  switchRole = role => {
    this.setState({ role })
  }

  handleCrudClick = param => {
    switch (param) {
      case 'add':
        return this.setState({ isAdding: true })
      default:
        break
    }
  }

  render() {
    let child
    if (this.state.isLoading)
      child = <div className="col s12 center-align">{React.cloneElement(this.props.children[0])}</div>
    else if (this.state.role === null)
      child = React.cloneElement(this.props.children[1], { onSubmit: this.switchRole })
    else if (this.state.isAdding)
      child = React.cloneElement(this.props.children[3])
    else if (this.state.role === 'guard' || this.state.role === 'hr')
      child = React.cloneElement(this.props.children[2], 
        { role: this.state.role, onSubmit: this.switchRole, onCrudClick: this.handleCrudClick })
    else if (this.state.role === 'admin')
      child = React.cloneElement(this.props.children[4])
    return (
      <div>{child}</div>
    )
  }
}