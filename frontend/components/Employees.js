import React, { Component } from 'react'

export class Employees extends Component {
  constructor() {
    super()
    this.state = {
      errorMessage: '',
      employees: [],
      isLoading: false,
      isAnimating: false,
      notAuthorized: false,
      isAdding: false,
      isEditing: false,
      isRemoving: false,
      currentKey: null
    }
  }

  handleAnimation = () => {
    if (this.state.notAuthorized)
      this.props.onSubmit(null)
    if (this.state.isAdding)
      this.props.onCrudClick('add')
    if (this.state.isEditing)
      this.props.onCrudClick('edit', this.state.currentKey)
    if (this.state.isRemoving)
      this.props.onCrudClick('remove', this.state.currentKey)
  }

  handleAddClick = () => {
    this.setState({ isAnimating: true, isAdding: true })
  }

  handleEditClick = key => {
    this.setState({ isAnimating: true, isEditing: true, currentKey: key })
  }

  handleRemoveClick = key => {
    this.setState({ isAnimating: true, isRemoving: true, currentKey: key })
  }

  handleLoading = field => {
    this.setState({ isLoading: true, errorMessage: '', employees: [] })
    fetch(`http://localhost:3502/api/employees?query=${field}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    })
    .then(res => {
      if (res.status === 404)
        throw 'Працівника не знайдено.'
      if (res.status === 401)
        throw 'Користувач не авторизований.'
      if (res.status === 200)
        return res.json()
    })
    .then(({ employee }) => {
      this.setState({ employees: employee, isLoading: false })
    })
    .catch(err => err === 'Користувач не авторизований.'
      ? this.setState({ isAnimating: true, notAuthorized: true })
      : this.setState({ errorMessage: err, isLoading: false }))
  }

  render() {
    return (
      <div className={this.state.isAnimating ? 'row slide-out' : 'row'}
      onAnimationEnd={this.handleAnimation}>
        {React.cloneElement(this.props.children[1], { onLoading: this.handleLoading })}
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
        <div className="col s12">
          <div className="custom-row">
            <div className="custom-col center-align"></div>
            {this.state.employees.length
            ? this.state.employees.map(employee => React.cloneElement(this.props.children[2], 
              { ...employee, role: this.props.role, key: employee._id, 
                onEditClick: this.handleEditClick, onRemoveClick: this.handleRemoveClick }))
            : ''}
            {this.props.role === 'hr'
            ? React.cloneElement(this.props.children[3], { onAddClick: this.handleAddClick })
            : ''}
          </div>
        </div>
      </div>
    )
  }
}