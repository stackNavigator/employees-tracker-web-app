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
import { TriggerScheduleButton } from './components/TriggerScheduleButton'
import { PersonalReport } from './components/PersonalReport'

ReactDOM.render(
  <Switcher url="https://employees-tracker.herokuapp.com/api/check-access">
    <Loader color="blue"/>
    <SignIn text="Вхід до системи" url="https://employees-tracker.herokuapp.com/api/signin">
      <Loader color="blue"/>
    </SignIn>
    <Employees>
      <SearchField url="https://employees-tracker.herokuapp.com/api/employees">
        <Loader color="blue"/>
      </SearchField>
      <InfoCard>
        <TriggerScheduleButton>
          <Loader color="blue"/>
        </TriggerScheduleButton>
      </InfoCard>
      <AddButton />
    </Employees>
    <RequestableUI url="https://employees-tracker.herokuapp.com/api/employees">
      <Loader color="blue"/>
      <InputForm 
      text="Внесення працівника"
      method="POST"
      crud="add"/>
    </RequestableUI>
    <RequestableUI url="https://employees-tracker.herokuapp.com/api/employee">
      <Loader color="blue"/>
      <InputForm 
      text="Редагування працівника"
      method="PATCH"
      crud="edit"/>
    </RequestableUI>
    <RequestableUI url="https://employees-tracker.herokuapp.com/api/employee">
      <Loader color="blue"/>
      <RemoveEmployee text="Видалення працівника"/>
    </RequestableUI>
    <RequestableUI url="https://employees-tracker.herokuapp.com/api/employee">
      <Loader color="blue"/>
      <PersonalReport text="Формування персонального звіту"/>
    </RequestableUI>
    <Admin />
  </Switcher>,
  document.querySelector('#app')
)