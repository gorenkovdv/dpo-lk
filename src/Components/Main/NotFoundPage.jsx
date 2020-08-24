import React from 'react'
import { compose } from 'redux'
import MainLayout from '../Main/MainLayout'
import withAuth from '../Authorization/withAuth'

const NotFound = () => {
    return <div>Страница не найдена</div>
}

export default compose(
    withAuth,
    MainLayout)(NotFound)