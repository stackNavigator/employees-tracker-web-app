import React, { Component } from 'react'

export class RequestableUI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      isLoading: false,
      isAnimating: false,
      notAuthorized: false,
      isResolved: false,
      isRejected: false,
      isActive: true
    }
  }

  handleAnimation = () => {
    if (this.state.notAuthorized)
      this.props.onSubmit(null)
    this.props.onCrudClick('remove')
  }

  onCrudClick = param => {
    this.props.onCrudClick(param)
  }

  onSubmit = param => {
    this.props.onSubmit(param)
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

  handleCancelClick = e => {
    e.preventDefault()
    this.setState({ isAnimating: true })
  }

  handleRequestStart = () => this.setState({ isLoading: true, errorMessage: '' })

  handleRequestError = () => this.setState({ errorMessage: err.message, isLoading: false })

  render() {
    return (
      <div className={this.state.isAnimating ? 'slide-out' : ''}
      onAnimationEnd={this.handleAnimation}>
        {React.cloneElement(this.props.children[1], { id: this.props.id,
        isActive: this.state.isActive, requestResult: this.handleRequestResult, 
        requestStart: this.handleRequestStart, requestError: this.handleRequestError, 
        cancelClick: this.handleCancelClick })}
        {this.state.errorMessage
        ?
        <div className="col s12 center-align err-message">
          <h5>{this.state.errorMessage}</h5>
        </div>
        : ''}
        {this.state.isLoading
        ?
        <div className="col s12 center-align">
          {React.cloneElement(this.props.children[0])}
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