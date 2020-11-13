const confirmDialogShow = (params) => {
  return { type: 'CONFIRM_DIALOG_SHOW', payload: params }
}

const confirmDialogClose = () => {
  return { type: 'CONFIRM_DIALOG_CLOSE' }
}

export default {
  confirmDialogShow,
  confirmDialogClose,
}
