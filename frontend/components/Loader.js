import React, { Component } from 'react'

export class Loader extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="preloader-wrapper big active">
        <div className={`spinner-layer spinner-${this.props.color}-only`}>
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div><div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
    </div>
    )
  }
}