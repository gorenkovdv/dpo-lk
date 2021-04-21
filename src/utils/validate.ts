const emailRegExp = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export const isEmailValid = (value: string) => {
  if (!value) return undefined
  if (!emailRegExp.test(value)) return `Некорректный формат email`
  return undefined
}

export const required = (value: string) => {
  if (!value || !value.length) return `Необходимо заполнить поле`
  return undefined
}

export const isStringContainsSymbol = (symbol: string) => (value: string) => {
  if (!value) return undefined
  if (value.indexOf(symbol) !== -1) return `Необходимо заполнить поле`
  return undefined
}

export const isStringContainsUnderscore = isStringContainsSymbol('_')
