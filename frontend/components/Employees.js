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
      <h1>{this.state.text}</h1>
    )
  }
}