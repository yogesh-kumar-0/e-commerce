import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import {Toaster} from 'sonner'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/Products/ProductDetails'
import CheckOut from './components/Cart/CheckOut'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './components/Products/AdminHomePage'
import UserMangement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProductPage from './components/Admin/EditProductPage'
import OrderManagement from './components/Admin/OrderManagement'

import { Provider } from 'react-redux'
import  store  from './redux/store'
import ProtectedRoute from './components/Common/ProtectedRoute'

const App = () => {
  
  return (
    <div>
      <Provider store={store}>
      <BrowserRouter future={{v7_startTransition:true, v7_relationSplatPath: true}}>
      <Toaster position='top-right'/>
      <Routes >
        <Route path='/' element={<UserLayout/>}> 
         <Route index element={<Home/>}></Route>
         <Route path='/login' element={<Login/>}></Route>
         <Route path='/register' element={<Register/>}></Route>
         <Route path='/profile' element={<Profile/>}></Route>
         <Route path='/collections/:collection' element={<CollectionPage/>}></Route>
         <Route path='product/:id' element={<ProductDetails/>}></Route>
         <Route path='/checkout' element={<CheckOut/>}></Route>
         <Route path='/order-confirmation' element={<OrderConfirmation />}></Route>
         <Route path='order/:id' element={<OrderDetailsPage/>}></Route>
         <Route path='my-orders' element={<MyOrdersPage/>}></Route>

         </Route>
         <Route path='/admin' element={<ProtectedRoute role="admin">
          <AdminLayout/>
          </ProtectedRoute>}>
         <Route index element={<AdminHomePage/>}></Route>
         <Route path='users' element={<UserMangement/>}></Route>
         <Route path='products' element={<ProductManagement/>}></Route>
         <Route path='products/:id/edit' element={<EditProductPage/>}></Route>
         <Route path='orders' element={<OrderManagement/>} ></Route>
         </Route>
       
        {/* <Route path='/admin' element={}></Route> */}
       

      </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
