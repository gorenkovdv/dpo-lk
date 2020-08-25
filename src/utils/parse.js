import * as moment from 'moment'

export const parseDate = (value) => {
  if (!value) return null
  return moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
}

export const parseMonth = (value) => {
  if (!value) return null
  return moment(value, 'MM-YYYY').format('MM-YYYY')
}
