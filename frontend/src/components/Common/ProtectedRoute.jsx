import React from 'react'
import {Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import { Children } from 'react';

const ProtectedRoute = ({children,role}) => {
    const {user} = useSelector((state)=> state.auth);

    if(!user || (role && user.user.role !== role)){
        return <Navigate to='/login' replace/>
    }
  return children;
}

export default ProtectedRoute
