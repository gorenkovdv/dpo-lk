import React from 'react'
import { useDispatch } from 'react-redux'
import { Field, reduxForm, submit } from 'redux-form'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import {
  Input,
  MaskedInput,
  DateInput,
} from '../Commons/FormsControls/FormsControls'
import { isStringContainsUnderscore, required } from '../../utils/validate.js'
import { parseDate } from '../../utils/parse.js'
import allActions from '../../store/actions'

const AddNewListenerWindow = ({ options, onClose }) => {
  const dispatch = useDispatch()

  const handleSubmit = (values) => {
    dispatch(allActions.coursesActions.addNewListener(values))
    onClose()
  }

  const initialValues = {
    lastName: 'Горенков',
    firstName: 'Дмитрий',
    middleName: 'Вячеславович',
    birthDate: '1995-12-27',
    snils: '11111111111',
  }

  return (
    <DialogLayout
      largeSize
      options={options}
      approveText="Добавить слушателя"
      cancelText="Отмена"
      onApprove={() => dispatch(submit('addNewListenerWindowForm'))}
      onClose={onClose}
      title={`Поиск/регистрация слушателя`}
    >
      <AddNewListenerWindowForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </DialogLayout>
  )
}

let AddNewListenerWindowForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        name="lastname"
        validate={[required]}
        component={Input}
        label="Фамилия"
      />
      <Field
        name="firstname"
        validate={[required]}
        component={Input}
        label="Имя"
      />
      <Field
        name="middlename"
        validate={[required]}
        component={Input}
        label="Отчество"
      />
      <Field
        name="birthDate"
        component={DateInput}
        parse={parseDate}
        views={['year', 'date']}
        maxDate={new Date()}
        dateformat="DD-MM-YYYY"
        placeholder="дд-мм-гггг"
        label="Дата рождения"
      />
      <Field
        name="snils"
        component={MaskedInput}
        validate={[isStringContainsUnderscore]}
        mask={`99999999999`}
        label="СНИЛС"
      />
    </form>
  )
}

AddNewListenerWindowForm = reduxForm({ form: 'addNewListenerWindowForm' })(
  AddNewListenerWindowForm
)

export default AddNewListenerWindow
