import React, { Component } from 'react'

export class Admin extends Component {
  constructor() {
    super()
    this.state = {
      text: 'Адмін'
    }
  }

  render() {
    return (
      <h1>{this.state.text}</h1>
    )
  }
}