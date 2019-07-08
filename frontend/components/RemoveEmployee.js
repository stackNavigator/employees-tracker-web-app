import React, { Component } from 'react'

export class RemoveEmployee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isAnimating: false,
      notAuthorized: false
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

  handleSubmit = () => {
    this.setState({ isLoading: true })
    fetch(`http://localhost:3502/api/employee/${this.props.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 401)
        throw 'Користувач не авторизований.'
    })
    .then(() => this.setState({ isAnimating: true }))
    .catch(err => err === 'Користувач не авторизований.' 
      ? this.setState({ isAnimating: true, notAuthorized: true }) 
      : '')
  }

  render() {
    return (
      <div className={this.state.isAnimating ? 'slide-out' : ''}
      onAnimationEnd={this.handleAnimation}>
      <h3 className="center-align">{this.props.text}</h3>
      <div className="row">
        <br />
        <h5 className="col s12 center-align">Ви впевнені у видаленні?</h5>
        {this.state.isLoading
          ?
          <div className="col s12 center-align">
            {React.Children.toArray(this.props.children)[0]}
          </div>
          :
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
          </div> }
      </div>
    </div>
    )
  }
}