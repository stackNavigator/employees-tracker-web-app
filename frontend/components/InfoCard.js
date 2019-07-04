import React, { Component } from 'react'

export class InfoCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
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
          { this.props.role === 'hr'
          ?
          <div className="card-action">
            <button className="btn-flat btn-edit">
              Редагувати
              <i className="material-icons right">assignment</i>
            </button>
            <button className="btn-flat btn-delete">
              Видалити
              <i className="material-icons right">clear</i>
            </button>
          </div>
          : ''}
        </div>
      </div>
    )
  }
}