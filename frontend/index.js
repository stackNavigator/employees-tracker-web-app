import React from 'react'
import ReactDOM from 'react-dom'
import 'materialize-css/dist/css/materialize.min.css'
import './css/style.css'

import { Switcher } from './components/Switcher'
import { SignIn } from './components/SignIn'
import { Employees } from './components/Employees'
import { Admin } from './components/Admin'
import { Loader } from './components/Loader'
import { SearchField } from './components/SearchField'


ReactDOM.render(
  <Switcher>
    <SignIn text='Вхід до системи'>
      <Loader color="blue"/>
    </SignIn>
    <Employees>
      <Loader color="blue"/>
      <SearchField />
    </Employees>
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)