import React from 'react'
import { useSelector } from 'react-redux'
import classes from './LoaderLayout.module.css'
import { AppStateType } from '../../../store/reducers/'

const LoaderLayout: React.FC = (): JSX.Element | null => {
  const isLoading = useSelector((state: AppStateType) => state.loader.isLoading)
  const colorClass = sessionStorage.pagesType === 'entity' ? classes.entity : ''
  return isLoading ? (
    <div className={classes.loader}>
      <div className={`${classes.ldsDualRing} ${colorClass}`} />
    </div>
  ) : null
}

export default LoaderLayout
