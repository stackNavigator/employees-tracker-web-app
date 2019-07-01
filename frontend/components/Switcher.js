import React, { Component } from 'react'

export class Switcher extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false
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

  render() {
    const children = this.props.children.map((child, i) => i === 0
      ? React.cloneElement(child)
      : React.cloneElement(child, { onSubmit: this.switchRole }))
    let child
    if (this.state.isLoading)
      child = <div className="col s12 center-align">{children[0]}</div>
    else if (this.state.role === null)
      child = children[1]
    else if (this.state.role === 'guard' || this.state.role === 'hr')
      child = children[2]
    else if (this.state.role === 'admin')
      child = children[3]
    return (
      <div>{child}</div>
    )
  }
}