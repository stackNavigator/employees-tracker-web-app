import React, { Component } from 'react'

export class TriggerScheduleButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasArrived: false,
      errorMessage: '',
      isLoading: false,
      isRejected: false,
      isResolved: false,
      isActive: true
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true, isActive: false })
    fetch(this.props.arrivalUrl, {
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
      if (res.status === 200)
        return res.json()
    })
    .then(({ hasArrived }) => this.setState({ hasArrived, isLoading: false, isActive: true }))
    .catch(err => {
      switch (err) {
        case 'Користувач не авторизований.':
          return this.handleRequestResult('rejected')
        default:
          return this.setState({ errorMessage: err.message, isLoading: false, isActive: true })
      }
    })
  }

  handleRequestResult = status => {
    if (status === 'resolved') {
      this.setState({ isLoading: false, isResolved: true, isActive: false })
      setTimeout(() => {
        this.props.setEmployees([])
      }, 1500)
    }
    if (status === 'rejected') {
      this.setState({ isLoading: false, isRejected: true, isActive: false })
      setTimeout(() => {
        this.props.triggerAnimation()
      }, 1500)
    }
  }

  handleSubmit = () => {
    this.setState({ isLoading: true, isActive: false, errorMessage: '' })
    fetch(this.props.url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 401)
        throw 'Користувач не авторизований.'
      if (res.status === 500)
        throw res.json()
      if (res.status === 200)
        return res.json()
    })
    .then(({ hasArrived }) => {
      this.setState({ hasArrived, isLoading: false, isActive: true })
      this.handleRequestResult('resolved')
  })
    .catch(err => {
      switch (err) {
        case 'Користувач не авторизований.':
          return this.handleRequestResult('rejected')
        default:
          return this.setState({ errorMessage: err.message, isLoading: false, isActive: true })
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.hasArrived && this.state.isActive
        ?
        <button className="btn-flat btn-departure" onClick={this.handleSubmit}>
          Відбув
          <i className="material-icons right">check</i>
        </button>
        : ''}
        {!this.state.hasArrived && this.state.isActive
        ?
        <button className="btn-flat btn-arrival" onClick={this.handleSubmit}>
          Прибув
          <i className="material-icons right">check</i>
        </button>
        : ''}
        {this.state.errorMessage
        ? 
        <div className="col s12 center-align err-message">
          <h5>{this.state.errorMessage}</h5>
        </div>
        : ''}
        {this.state.isLoading
        ?
        <div className="col s12 center-align">
          {React.Children.toArray(this.props.children)[0]}
        </div>
        : ''}
        {this.state.isResolved
        ?
        <div className="col s12 center-align">
          <i className="material-icons resolve-tooltip">check</i>
        </div>
        : ''}
        {this.state.isRejected
        ?
        <div className="col s12 center-align">
          <i className="material-icons reject-tooltip">clear</i>
        </div>
        : ''}
      </div>
    )
  }
}