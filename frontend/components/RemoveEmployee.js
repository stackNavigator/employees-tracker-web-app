import React, { Component } from 'react'

export class RemoveEmployee extends Component {
  constructor(props) {
    super(props)
  }

  handleCancelClick = e => {
    this.props.cancelClick(e, 'remove')
  }

  handleSubmit = () => {
    this.props.requestStart('remove')
    fetch(`${this.props.url}/${this.props.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 401)
        throw 'Користувач не авторизований.'
      if (res.status === 500)
        throw res.json()
      return res.json()
    })
    .then(() => this.props.requestResult('resolved'))
    .catch(err => err === 'Користувач не авторизований.' 
      ? this.props.requestResult('rejected')
      : this.props.requestError(err))
  }

  render() {
    return (
      <div>
        <h3 className="center-align">{this.props.text}</h3>
        <div className="row">
          <br />
          <h5 className="col s12 center-align">Ви впевнені у видаленні?</h5>
          {this.props.isActive
          ?
          <div className="col s12 center-align">
            <div className="col s12 m6 center-align">
              <button className="btn-flat btn-edit" onClick={this.handleSubmit}>
                Підтвердити
              </button>
            </div>
            <div className="col s12 m6 center-align">
              <button className="btn-flat btn-delete" onClick={this.handleCancelClick}>
                Скасувати
              </button>
            </div>
          </div>
          : ''}
        </div>
      </div>
    )
  }
}