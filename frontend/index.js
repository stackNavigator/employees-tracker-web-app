import React from 'react'
import ReactDOM from 'react-dom'
import 'materialize-css/dist/css/materialize.min.css'

import { Switcher } from './components/Switcher'
import { SignIn } from './components/SignIn'
import { Employees } from './components/Employees'
import { Admin } from './components/Admin'


ReactDOM.render(
  <Switcher>
    <SignIn />
    <Employees />
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)