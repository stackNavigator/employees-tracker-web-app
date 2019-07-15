import React, { Component } from 'react'

export class InfoCard extends Component {
  constructor(props) {
    super(props)
  }

  handleEditClick = key => {
    this.props.onEditClick(key)
  }

  handleRemoveClick = key => {
    this.props.onRemoveClick(key)
  }

  render() {
    return (
      <div className="custom-col center-align">
        <div className="card">
          <div className="card-image">
            <img className="employee-pic" src={this.props.profilePic} />
          </div>
          <span className="card-title">
            {`${this.props.surname} ${this.props.name} ${this.props.secondName}`}
          </span>
          <div className="card-content">
            <span>Табельний номер: <b>{this.props.personnelName}</b></span>
            <br />
            <span>{this.props.position}</span>
          </div>
          {this.props.role === 'guard' 
          ?
          <div className="card-action">
            {React.cloneElement(this.props.children, { 
            url: `http://localhost:3502/api/schedule/${this.props._id}`,
            arrivalUrl: `http://localhost:3502/api/schedule/${this.props._id}/check-arrival`,
            triggerAnimation: this.props.triggerAnimation, setEmployees: this.props.setEmployees })}
          </div>
          : ''}
          {this.props.role === 'hr'
          ?
          <div className="card-action">
            <button className="btn-flat btn-edit" 
            onClick={() => this.handleEditClick(this.props._id)}>
              Редагувати
              <i className="material-icons right">assignment</i>
            </button>
            <button className="btn-flat btn-delete" 
            onClick={() => this.handleRemoveClick(this.props._id)}>
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