import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { MaskedInput, Input } from '../Commons/FormsControls/FormsControls'
import { required, isStringContainsUnderscore } from '../../utils/validate'

interface IValues {
  speciality: string
  number: string
}

const RequestCMEForm: React.FC<InjectedFormProps<IValues>> = ({ handleSubmit }) => {
  const specialityFieldRef: React.RefObject<HTMLInputElement> = React.createRef();

  React.useEffect(() => {
    specialityFieldRef.current && specialityFieldRef.current.focus()
  }, [specialityFieldRef])

  return (
    <form onSubmit={handleSubmit}>
      <Field
        inputRef={specialityFieldRef}
        name="speciality"
        component={Input}
        label="Специальность"
        validate={required}
        required
      />
      <Field
        name="number"
        component={MaskedInput}
        mask={`NMO-999999-2099`}
        label="Номер документа"
        validate={[required, isStringContainsUnderscore]}
        required
      />
    </form>
  )
}

const RequestCMEReduxForm = reduxForm<IValues>({
  form: 'requestCMEForm'
})(RequestCMEForm)

export default RequestCMEReduxForm
