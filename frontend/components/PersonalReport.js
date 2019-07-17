import React, { Component } from 'react'

export class PersonalReport extends Component {
  constructor(props) {
    super(props)
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  handleCancelClick = e => {
    this.props.cancelClick(e, 'personalReport')
  }

  handleSubmit = () => {
    this.props.requestStart('personalReport')
    const [ id, name ] = this.props.id.split(',')
    const fromDate = new Date(`${document.querySelector('#fromDate').value || '01/01/1970'},00:00`).toISOString()
    const toDate = new Date(`${document.querySelector('#toDate').value || '01/01/1970'},00:00`).toISOString()
    const query = `?fromDate=${fromDate}&toDate=${toDate}`
    fetch(`${this.props.url}/${id}/personal-report${query}`, {
      method: 'GET',
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
    .then(({ reportData: [ data ]}) => {
      const { effectiveSchedule } = data
      if (!effectiveSchedule.length) throw new Error('За наведеними датами інформація відсутня.')
      const schedule = effectiveSchedule.map(({ range }) => range)
      this.props.requestResult('resolved')
      console.log(schedule)
    })
    .catch(err => err === 'Користувач не авторизований.' 
    ? this.props.requestResult('rejected')
    : this.props.requestError(err))
  }

  render() {
    return (
      <div>
        <h3 className="center-align">{this.props.text}</h3>
        <div className="row">
          <div className="col s12">
            <div className="col s12 m2 center-align"><h6>Початкова дата</h6></div>
            <div className="col s12 m10">
              <input id="fromDate" placeholder="Виберіть початкову дату" type="date" required/>
            </div>
          </div>
          <div className="col s12">
            <div className="col s12 m2 center-align"><h6>Кінцева дата</h6></div>
            <div className="col s12 m10">
              <input id="toDate" placeholder="Виберіть кінцеву дату" type="date" required/>
            </div>
          </div>
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