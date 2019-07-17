import React, { Component } from 'react'
import * as Excel from 'exceljs/dist/exceljs'

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

  formReport = (header, data) => {
    const wb = new Excel.Workbook()
    const ws = wb.addWorksheet('Звіт', { pageSetup: { paperSize: 9, orientation: 'landscape' }
    })
    ws.columns = [
      { width: 32, style: { font: { size: 16}, alignment: { 
        vertical: 'middle', horizontal: 'center'
      }, border: {
        left: {
            style: 'thin',
            color: '#000000'
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        }
      }} }
    ]
    ws.getCell('A1').value = header
    for (let i = 0; i < data.length; i++)
      ws.getCell(`A${i + 2}`).value = data[i]
    return wb
  }

  handleSubmit = () => {
    this.props.requestStart('personalReport')
    const [ id ] = this.props.id.split(',')
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
      const [ _, name ] = this.props.id.split(',')
      const schedule = effectiveSchedule.map(({ range }) => range)
      return this.formReport(name, schedule).xlsx.writeBuffer()
    })
    .then(buffer => {
      const [fromYear, fromDay, fromMonth] = document.querySelector('#fromDate').value.split('-')
      const [ toYear, toDay, toMonth ] = document.querySelector('#toDate').value.split('-')
      const url = window.URL.createObjectURL(new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `Звіт з ${fromDay}-${fromMonth}-${fromYear} по ${toDay}-${toMonth}-${toYear}.xlsx`
      anchor.click()
      window.URL.revokeObjectURL(url)
      this.props.requestResult('resolved')
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