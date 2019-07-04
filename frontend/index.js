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
import { InfoCard } from './components/InfoCard'
import { AddButton } from './components/AddButton'

ReactDOM.render(
  <Switcher>
    <Loader color="blue"/>
    <SignIn text='Вхід до системи'>
      <Loader color="blue"/>
    </SignIn>
    <Employees>
      <Loader color="blue"/>
      <SearchField />
      <InfoCard />
      <AddButton />
    </Employees>
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)