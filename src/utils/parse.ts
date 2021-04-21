import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import moment from 'moment'
import { IUserOption } from '../types'

export const parseDate = (value: MaterialUiPickersDate) => value ? moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD') : null

export const parseCourseDate = (value: string | null, minDate: string | null, maxDate: string | null) => {
  if (value === null) return value

  let currentValue = moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
  if (minDate === null || maxDate === null) return currentValue

  let currentMinDate = moment(minDate).format('YYYY-MM-DD')
  let currentMaxDate = moment(maxDate).format('YYYY-MM-DD')

  if (currentValue < currentMinDate || currentValue > currentMaxDate)
    return null

  return currentValue
}

export const parseMonth = (value: Date) => value ? moment(value).format('MM-YYYY') : null

export const formatMonth = (value: string) => value ? new Date(
  parseInt(value.split('-')[1]),
  parseInt(value.split('-')[0]) - 1
) : null

export const parseUserOption = (option: IUserOption) => `${option.name} ${option.login.length > 0 ? `(${option.login})` : ``}`
