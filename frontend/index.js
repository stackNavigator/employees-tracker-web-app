import React from 'react'
import ReactDOM from 'react-dom'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import './css/style.css'

import { Switcher } from './components/Switcher'
import { SignIn } from './components/SignIn'
import { Employees } from './components/Employees'
import { Admin } from './components/Admin'
import { Loader } from './components/Loader'
import { SearchField } from './components/SearchField'
import { InfoCard } from './components/InfoCard'
import { AddButton } from './components/AddButton'
import { AddEmployee } from './components/AddEmployee'
import { EditEmployee } from './components/EditEmployee'
import { RemoveEmployee } from './components/RemoveEmployee'

ReactDOM.render(
  <Switcher>
    <Loader color="blue"/>
    <SignIn text="Вхід до системи">
      <Loader color="blue"/>
    </SignIn>
    <Employees>
      <Loader color="blue"/>
      <SearchField />
      <InfoCard />
      <AddButton />
    </Employees>
    <AddEmployee text="Внесення працівника">
      <Loader color="blue" />
    </AddEmployee>
    <EditEmployee text="Редагування працівника">
      <Loader color="blue" />
    </EditEmployee>
    <RemoveEmployee text="Видалення працівника">
      <Loader color="blue" />
    </RemoveEmployee>
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)