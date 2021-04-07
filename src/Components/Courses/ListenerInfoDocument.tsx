import React from 'react'
import { Field } from 'redux-form'
import {
  Grid,
  Typography,
  Collapse,
  Box,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { RadioGroupContainer } from '../Commons/FormsControls/FormsControls'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { SAVE_FILES_DIRECTORY } from '../../store/const'
import { userAPI } from '../../services/api'
import { IDocument } from '../../types'

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2, 0),
  },
  pointer: {
    cursor: 'pointer',
  },
  startIcon: {
    marginRight: theme.spacing(1),
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
}))

interface IProps {
  document: IDocument,
  index: number
}

const ListenerInfoDocument: React.FC<IProps> = ({ document, index }) => {
  const classes = useStyles()
  const [documentInfoOpen, setDocumentInfoOpen] = React.useState(false)
  const username = userAPI.getUserName().toLowerCase()

  const radioButtons = [
    { value: '0', label: 'Не верно' },
    { value: '1', label: 'Верно' },
  ]

  return (
    <>
      <Grid
        container
        alignItems="center"
        onClick={() => setDocumentInfoOpen(!documentInfoOpen)}
        className={classes.pointer}
        direction="row"
        style={{ margin: '4px 0' }}
      >
        <Grid item>
          <IconButton size="small" className={classes.startIcon}>
            {documentInfoOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Grid>
        <Grid item>
          <Typography>{document.name}</Typography>
        </Grid>
      </Grid>
      <Collapse in={documentInfoOpen} timeout="auto" unmountOnExit>
        <Box margin={0.5}>
          {document.fileURL ? (
            <Grid container direction="row" alignItems="center">
              <a
                className={classes.link}
                href={`${SAVE_FILES_DIRECTORY}${username}/${document.fileURL}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Скан-копия</span>
              </a>
            </Grid>
          ) : null}
          <Field
            name={`documents[${index}].documentCheck`}
            direction="row"
            component={RadioGroupContainer}
            radios={radioButtons}
          />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {document.type?.toString() !== "6" ? (
                  <>
                    <TableRow>
                      <TableCell style={{ width: '30%' }} align="right">
                        Организация
                      </TableCell>
                      <TableCell align="left">
                        {document.organization}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">Специальность</TableCell>
                      <TableCell align="left">{document.speciality}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">
                        Серия, номер документа
                      </TableCell>
                      <TableCell align="left">{document.serial}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">
                        {document.firstDateName}
                      </TableCell>
                      <TableCell align="left">{document.firstDate}</TableCell>
                    </TableRow>
                    {document.secondDate && (
                      <TableRow>
                        <TableCell align="right">
                          {document.secondDateName}
                        </TableCell>
                        <TableCell align="left">
                          {document.secondDate}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ) : (
                  <>
                    <TableRow>
                      <TableCell style={{ width: '30%' }} align="right">
                        Комментарий
                      </TableCell>
                      <TableCell align="left">{document.comment}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </>
  )
}

export default ListenerInfoDocument
