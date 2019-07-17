import React, { Component } from 'react'

export class Employees extends Component {
  constructor() {
    super()
    this.state = {
      employees: [],
      notAuthorized: false,
      isAnimating: false,
      isAdding: false,
      isEditing: false,
      isRemoving: false,
      isPersonalReporting: false,
      currentKey: null,
      searchField: ''
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
    if (this.state.isPersonalReporting)
      this.props.onCrudClick('personalReport', this.state.currentKey)
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

  handlePersonalReportClick = key => {
    this.setState({ isAnimating: true, isPersonalReporting: true, currentKey: key })
  }

  handleInputChange = ({ target: { value }}) => {
    this.setState({ searchField: value })
  }

  triggerAnimation = () => this.setState({ isAnimating: true, notAuthorized: true })

  setEmployees = employee => this.setState({ employees: employee, searchField: '' })

  render() {
    return (
      <div className={this.state.isAnimating ? 'row slide-out' : 'row'}
      onAnimationEnd={this.handleAnimation}>
        {React.cloneElement(this.props.children[0], { triggerAnimation:  this.triggerAnimation,
        setEmployees: this.setEmployees, searchField: this.state.searchField, 
        onInputChange: this.handleInputChange })}
        <div className="col s12">
          <div className="custom-row">
            <div className="custom-col center-align"></div>
            {this.state.employees.length
            ? this.state.employees.map(employee => React.cloneElement(this.props.children[1],
              { ...employee, role: this.props.role, key: employee._id, 
              triggerAnimation: this.triggerAnimation, setEmployees: this.setEmployees,
              onEditClick: this.handleEditClick, onRemoveClick: this.handleRemoveClick,
               onPersonalReportClick: this.handlePersonalReportClick }))
            : ''}
            {this.props.role === 'hr'
            ? React.cloneElement(this.props.children[2], { onAddClick: this.handleAddClick })
            : ''}
          </div>
        </div>
      </div>
    )
  }
}