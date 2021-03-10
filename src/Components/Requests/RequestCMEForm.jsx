import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { MaskedInput, Input } from '../Commons/FormsControls/FormsControls'
import { required, isStringContainsUnderscore } from '../../utils/validate'

let RequestCMEForm = (props) => {
  const specialityFieldRef = React.useRef(null)

  React.useEffect(() => {
    specialityFieldRef.current.focus()
  }, [])

  return (
    <form onSubmit={props.handleSubmit}>
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

RequestCMEForm = reduxForm({ form: 'requestCMEForm' })(RequestCMEForm)

export default RequestCMEForm
