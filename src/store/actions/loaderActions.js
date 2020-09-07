const setLoading = () => {
  return { type: 'LOADER_REQUEST_LOADING' }
}
const loadingSuccess = () => {
  return { type: 'LOADER_LOADING_SUCCESS' }
}

export default {
  setLoading,
  loadingSuccess,
}
