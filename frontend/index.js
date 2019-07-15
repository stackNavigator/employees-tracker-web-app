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
import { RequestableUI } from './components/RequestableUI'
import { SearchField } from './components/SearchField'
import { InfoCard } from './components/InfoCard'
import { AddButton } from './components/AddButton'
import { InputForm } from './components/InputForm'
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
    <RequestableUI url="http://localhost:3502/api/employees">
      <Loader color="blue"/>
      <InputForm 
      text="Внесення працівника"
      method="POST"
      crud="add"/>
    </RequestableUI>
    <RequestableUI url="http://localhost:3502/api/employee">
      <Loader color="blue"/>
      <InputForm 
      text="Редагування працівника"
      method="PATCH"
      crud="edit"/>
    </RequestableUI>
    <RequestableUI url="http://localhost:3502/api/employee">
      <Loader color="blue" />
      <RemoveEmployee text="Видалення працівника" />
    </RequestableUI>
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)