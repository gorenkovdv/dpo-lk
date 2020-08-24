const emailRegExp = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export const isEmailValid = value => {
    if(!value) return undefined
    if(!emailRegExp.test(value)) return "Некорректный формат email"
    return undefined
}

export const isStringContainsSymbol = symbol => value => {
    if(!value) return undefined
    if(value.indexOf('_') !== -1) return `String contains unallowed symbol '${symbol}'`
    return undefined
}

export const isStringContainsUnderscore = isStringContainsSymbol('_')

export const maxLengthCreator = maxLength => value => {
    if(!value) return undefined
    if(value.lenth > maxLength) return `Max length is ${maxLength} symbols`
    return undefined
}