import React from 'react'
import HtmlTooltip from './HtmlTooltip'
import { IconButton} from '@material-ui/core'
import { Help as HelpIcon } from '@material-ui/icons'

export const localityTooltip = (
    <HtmlTooltip
        title={
          <>
            <span>
            Введите наименование населенного пункта без указания типа, например
            Барнаул
            </span>
          </>
        }
    >
        <IconButton style={{ marginRight: 10 }} size="small">
          <HelpIcon />
        </IconButton>
    </HtmlTooltip>
)
    
export const streetTooltip = (
    <HtmlTooltip
      title={
        <>
          <span>
              Введите наименование улицы, с указанием типа&nbsp;
              <u>после имени</u>, например, Ленина <u>ул.</u>
              или Ленина <u>просп.</u>
          </span>
        </>
      }
    >
        <IconButton style={{ marginRight: 10 }} size="small">
            <HelpIcon />
        </IconButton>
    </HtmlTooltip>
)