import React, { Component } from 'react'

export class RemoveEmployee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      isLoading: false,
      isAnimating: false,
      notAuthorized: false,
      isResolved: false,
      isRejected: false,
      isActive: true,
    }
  }

  handleAnimation = () => {
    if (this.state.notAuthorized)
      this.props.onSubmit(null)
    this.props.onCrudClick('remove')
  }

  handleCancelClick = () => {
    this.setState({ isAnimating: true })
  }

  handleRequestResult = status => {
    this.setState({ isActive: false })
    if (status === 'resolved')
      this.setState({ isLoading: false, isResolved: true })
    if (status === 'rejected')
      this.setState({ isLoading: false, isRejected: true, notAuthorized: true })
    setTimeout(() => {
      this.setState({ isAnimating: true })
    }, 1500)
  }


  handleSubmit = () => {
    this.setState({ isLoading: true, errorMessage: '' })
    fetch(`http://localhost:3502/api/employee/${this.props.id}`, {
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
    })
    .then(() => this.handleRequestResult('resolved'))
    .catch(err => err === 'Користувач не авторизований.' 
      ? this.handleRequestResult('rejected') 
      : this.setState({ errorMessage: err.message, isLoading: false }))
  }

  render() {
    return (
      <div className={this.state.isAnimating ? 'slide-out' : ''}
      onAnimationEnd={this.handleAnimation}>
      <h3 className="center-align">{this.props.text}</h3>
      <div className="row">
        <br />
        <h5 className="col s12 center-align">Ви впевнені у видаленні?</h5>
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
        {this.state.isActive
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