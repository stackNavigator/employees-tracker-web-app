import React, { Component } from 'react'

export class Switcher extends Component {
  constructor() {
    super()
    this.state = {
      role: null,
    }
  }

  render() {
    let child
    if (this.state.role === null)
      child = React.cloneElement(React.Children.toArray(this.props.children)[0])
    if (this.state.role === 'guard' || this.state.role === 'hr')
      child = React.cloneElement(React.Children.toArray(this.props.children)[1])
    if (this.state.role === 'admin')
      child = React.cloneElement(React.Children.toArray(this.props.children)[2])
    return (
      <div>
        <h1>{this.state.text}</h1>
        {child}
      </div>
    )
  }
}