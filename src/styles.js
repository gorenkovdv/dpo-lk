const styles = (theme) => ({
  h3: {
    textAlign: 'center',
    fontWeight: 500,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 26,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
  typography: {
    boxSizing: 'border-box',
    padding: theme.spacing(1, 0),
  },
  textField: {
    boxSizing: 'border-box',
    width: '100%',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  documentButton: {
    marginTop: 20,
    width: '100%',
    maxWidth: 250,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  form: {
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    width: 400,
    maxWidth: '100%',
  },
  link: {
    textAlign: 'center',
    margin: theme.spacing(1, 0),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
  h6: {
    margin: theme.spacing(1.25, 0),
  },
  startIcon: {
    marginRight: theme.spacing(1),
  },
  inputStartIcon: {
    marginRight: theme.spacing(1.25),
    color: 'gray',
  },
  inputEndIcon: {
    marginLeft: theme.spacing(1),
    padding: 3,
    color: 'gray',
  },
  iconTitle: {
    marginLeft: theme.spacing(1.25),
  },
  verticalMargin: {
    margin: theme.spacing(2, 0),
  },
  mainColor: {
    color: theme.palette.primary.main,
  },
  fileLabel: {
    margin: theme.spacing(0, 0.75, 0, 1.25),
    display: 'inline-block',
    fontSize: '0.75em',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  inlineBlock: {
    display: 'inline-block',
  },
  pointer: {
    cursor: 'pointer',
  },
  bold: {
    fontWeight: 'bold',
  },
  fullWidth: {
    width: '100%',
  },
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
  mobileTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  block: {
    display: 'block',
  },
})

export default styles
