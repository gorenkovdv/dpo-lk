import { Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      fontSize: theme.typography.pxToRem(12),
      padding: theme.spacing(1),
    },
}))(Tooltip)

export default HtmlTooltip