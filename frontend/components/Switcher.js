import React, { Component } from 'react'

export class Switcher extends Component {
  constructor() {
    super()
    this.state = {
      role: 'hr',
    }
  }

  switchRole = role => {
    this.setState({ role })
  }

  render() {
    const children = this.props.children.map(child => React.cloneElement(child, 
      { onSubmit: this.switchRole }))
    let child
    if (this.state.role === null)
      child = children[0]
    if (this.state.role === 'guard' || this.state.role === 'hr')
      child = children[1]
    if (this.state.role === 'admin')
      child = children[2]
    return (
      <div>{child}</div>
    )
  }
}