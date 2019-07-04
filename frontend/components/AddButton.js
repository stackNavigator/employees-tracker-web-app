import React, { Component } from 'react'

export class AddButton extends Component {
  constructor(props) {
    super(props)
  }

  handleClick = () => {
    this.props.onCrudClick('add')
  }

  render() {
    return (
      <div className="custom-col">
        <div className="add-container">
          <button className="add-button btn-flat" onClick={this.handleClick}>
            <div className="center-align">
              <i className="material-icons add-icon center-align">person_add</i>
            </div>
          </button>
        </div>
      </div>
    )
  }
}