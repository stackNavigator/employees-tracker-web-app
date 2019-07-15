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
    <InputForm 
    text="Внесення працівника"
    url="http://localhost:3502/api/employees"
    method="POST"
    crud="add">
      <Loader color="blue" />
    </InputForm>
    <InputForm 
    text="Редагування працівника"
    method="PATCH"
    crud="edit">
      <Loader color="blue" />
    </InputForm>
    <RequestableUI>
      <Loader color="blue" />
      <RemoveEmployee text="Видалення працівника" />
    </RequestableUI>
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)