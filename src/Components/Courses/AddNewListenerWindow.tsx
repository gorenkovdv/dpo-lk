import React from 'react'
import { useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import DialogLayout from '../Commons/Dialog/DialogLayout'
import {
  Input,
  MaskedInput,
  DateInput,
} from '../Commons/FormsControls/FormsControls'
import { isStringContainsUnderscore, required } from '../../utils/validate'
import { parseDate } from '../../utils/parse'
import { addNewListener } from '../../store/reducers/courses'

interface IProps {
  options: {
    open: boolean
  },
  onClose: () => void
}

interface IFormProps {
  lastname: string
  firstname: string
  middlename: string
  birthdate: string
  snils: string,
}

const AddNewListenerWindow: React.FC<IProps> = ({ options, onClose }): JSX.Element => {
  const dispatch = useDispatch()

  const handleSubmit = (values: IFormProps) => {
    dispatch(addNewListener(values))
  }

  const initialValues: IFormProps = {
    lastname: 'Горенков',
    firstname: 'Дмитрий',
    middlename: 'Вячеславович',
    birthdate: '1995-12-27',
    snils: '24234234234',
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
      <AddNewListenerWindowReduxForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </DialogLayout>
  )
}

const AddNewListenerWindowForm: React.FC<InjectedFormProps<IFormProps>> = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="lastname"
        validate={[required]}
        component={Input}
        label="Фамилия"
        required
      />
      <Field
        name="firstname"
        validate={[required]}
        component={Input}
        label="Имя"
        required
      />
      <Field
        name="middlename"
        validate={[required]}
        component={Input}
        label="Отчество"
        required
      />
      <Field
        name="birthdate"
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

const AddNewListenerWindowReduxForm = reduxForm<IFormProps>({ form: 'addNewListenerWindowForm' })(AddNewListenerWindowForm)

export default AddNewListenerWindow
