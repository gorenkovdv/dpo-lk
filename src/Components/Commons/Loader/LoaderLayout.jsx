import React from 'react'

import classes from './LoaderLayout.module.css'

const LoaderLayout = () => {
  const colorClass = sessionStorage.pagesType === 'entity' ? classes.entity : ''
  return (
    <div className={classes.loader}>
      <div className={`${classes.ldsDualRing} ${colorClass}`} />
    </div>
  )
}

export default LoaderLayout
