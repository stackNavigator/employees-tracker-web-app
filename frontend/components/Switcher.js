import React, { Component } from 'react'

export class Switcher extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isAdding: false,
      isEditing: false,
      isRemoving: false,
      currentId: null
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch(`http://localhost:3502/api/check-access`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      if (res.status === 200)
        return res.json()
      throw new Error()
    })
    .then(({ role }) => {
      this.setState({ role, isLoading: false })
    })
    .catch(() => {
      localStorage.removeItem('token')
      this.setState({
        role: null,
        isLoading: false
      })
    })
  }

  switchRole = role => {
    this.setState({ role })
  }

  handleCrudClick = (action, key) => {
    switch (action) {
      case 'add':
        return this.setState(({ isAdding }) => ({ isAdding: !isAdding }))
      case 'edit':
        return this.setState(({ isEditing }) => ({isEditing: !isEditing, currentId: key }))
      case 'remove':
        return this.setState(({ isRemoving }) => ({ isRemoving: !isRemoving, currentId: key }))
      default:
        break
    }
  }

  chooseChild = () => {
    switch (true) {
      case this.state.isLoading:
        return <div className="col s12 center-align">{React.cloneElement(this.props.children[0])}</div>
      case this.state.role === null:
        return React.cloneElement(this.props.children[1], { onSubmit: this.switchRole })
      case this.state.isAdding:
        return React.cloneElement(this.props.children[3], { onCrudClick: this.handleCrudClick,
          onSubmit: this.switchRole })
      case this.state.isEditing:
        return React.cloneElement(this.props.children[4], { onCrudClick: this.handleCrudClick,
          onSubmit: this.switchRole,
          url: `http://localhost:3502/api/employee/${this.state.currentId}` })
      case this.state.isRemoving:
        return React.cloneElement(this.props.children[5], { onCrudClick: this.handleCrudClick,
          onSubmit: this.switchRole, id: this.state.currentId })
      case this.state.role === 'guard' || this.state.role === 'hr':
        return React.cloneElement(this.props.children[2], 
          { role: this.state.role, onSubmit: this.switchRole, onCrudClick: this.handleCrudClick })
      case this.state.role === 'admin':
        return React.cloneElement(this.props.children[6])
      default:
        break
    }
  }

  render() {
    return (
      <div>{this.chooseChild()}</div>
    )
  }
}