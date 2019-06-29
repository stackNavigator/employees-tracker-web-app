import React, { Component } from 'react'

export class Employees extends Component {
  constructor() {
    super()
    this.state = {
      text: 'Робота з працівниками'
    }
  }

  render() {
    return (
      <div className="row">
        {this.props.children[1]}
      </div>
    )
  }
}