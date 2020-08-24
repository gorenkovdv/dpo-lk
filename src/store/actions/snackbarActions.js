
const showSuccess = message => { return { type: 'SNACKBAR_SHOW_SUCCESS_MESSAGE', payload: message }}
const showError = error => { return { type: 'SNACKBAR_SHOW_ERROR_MESSAGE', payload: error }}
const clearSnackbar = () => { return { type: 'SNACKBAR_CLEAR' }}

export default{
    showSuccess,
    showError,
    clearSnackbar,
}