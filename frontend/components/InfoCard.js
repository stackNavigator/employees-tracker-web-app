import React, { Component } from 'react'

export class InfoCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="custom-row">
        <div className="custom-col center-align"></div>
        <div className="custom-col center-align">
          <div className="card">
            <div className="card-image">
              <img className="employee-pic" src="https://via.placeholder.com/350" />
            </div>
            <span className="card-title">
              {`${this.props.surname} ${this.props.name} ${this.props.secondName}`}
            </span>
            <div className="card-content">
              <span>Табельний номер: {this.props.personnelName}</span>
              <br />
              <span>{this.props.position}</span>
            </div>
          </div>
        </div>
        <div className="custom-col">
          <div className="add-container">
            <button className="add-button btn-flat">
              <div className="center-align">
                <i className="material-icons add-icon center-align">person_add</i>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }
}