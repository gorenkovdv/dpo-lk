import React from 'react'
import HtmlTooltip from './HtmlTooltip'
import { IconButton } from '@material-ui/core'
import { Help as HelpIcon } from '@material-ui/icons'

export const loadFileTooltip: JSX.Element = (
  <HtmlTooltip
    title={
      <>
        <span>
          Формат загружаемого файла - PDF<br />
            Максимальный размер файла - 5 Мб
            </span>
      </>
    }
  >
    <IconButton style={{ marginLeft: 10 }} size="small">
      <HelpIcon />
    </IconButton>
  </HtmlTooltip>
)