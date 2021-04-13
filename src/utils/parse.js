import * as moment from 'moment'

export const parseDate = (value) => {
  if (!value) return null
  return moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
}

export const parseCourseDate = (value, minDate, maxDate) => {
  if (!value) return null

  let currentValue = moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
  let currentMinDate = moment(minDate).format('YYYY-MM-DD')
  let currentMaxDate = moment(maxDate).format('YYYY-MM-DD')

  if (currentValue < currentMinDate || currentValue > currentMaxDate)
    return null

  return currentValue
}

export const parseMonth = (value) => {
  if (!value) return null
  return moment(value, 'MM-YYYY').format('MM-YYYY')
}

export const parseUserOption = (option) => `${option.name} ${option.login.length > 0 ? `(${option.login})` : ``}`
