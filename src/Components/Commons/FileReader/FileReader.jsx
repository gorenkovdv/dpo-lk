import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, IconButton } from '@material-ui/core'
import {
  CloudUpload as CloudUploadIcon,
  HighlightOff as DropIcon,
} from '@material-ui/icons'
import { loadFileTooltip } from '../Tooltips/LoadFileTooltip'
import { red } from '@material-ui/core/colors'
import ReactFileReader from 'react-file-reader'
import styles from '../../../styles'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  button: {
    ...styles(theme).button,
    marginTop: 0,
  },
}))

const FileReader = ({ newFile, fileTypes, onFileSelect, onFileDrop }) => {
  const classes = useStyles()

  return (
    <Grid
      container
      style={{ marginTop: 10 }}
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <ReactFileReader
        fileTypes={fileTypes}
        base64={true}
        multipleFiles={false}
        handleFiles={onFileSelect}
      >
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
        >
          Загрузить файл
        </Button>
      </ReactFileReader>
      <Grid
        container
        style={{ width: 'auto', marginLeft: 8 }}
        direction="row"
        justify="center"
        alignItems="center"
      >
        {loadFileTooltip}
        {newFile ? (
          <>
            <span className={classes.fileLabel}>{newFile.fileName}</span>
            <IconButton size="small" onClick={onFileDrop}>
              <DropIcon style={{ color: red.A700 }} />
            </IconButton>
          </>
        ) : (
          <span className={classes.fileLabel}>Файл не загружен</span>
        )}
      </Grid>
    </Grid>
  )
}

export default FileReader
