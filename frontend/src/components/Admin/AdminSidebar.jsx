import React from 'react'
import {
  FaBoxOpen,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaStore,
  FaTachometerAlt,
  FaUser,
} from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slice/authSlice'
import { clearCart } from '../../redux/slice/cartSlice'

const AdminSidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2'

  return (
    <div className='p-6'>
      {/* Brand */}
      <div className='mb-4'>
        <Link to='/' className='text-2xl font-bold text-white tracking-tight'>
          Xpert Enterprises
        </Link>
      </div>

      {/* ← Back to Home — visually distinct, secondary style */}
      <Link
        to='/'
        className='flex items-center gap-2 mb-4 text-gray-400 border border-gray-600
                   hover:border-gray-300 hover:text-white py-2 px-3 rounded text-sm
                   transition-colors duration-200'
      >
        <FaHome className='text-xs' />
        <span>← Back to Home Page</span>
      </Link>

      {/* Divider */}
      <div className='border-t border-gray-700 mb-4' />

      {/* Dashboard link — primary, uses NavLink with `end` so only active on exact /admin */}
      <NavLink
        to='/admin'
        end
        className={({ isActive }) =>
          `flex items-center gap-2 mb-6 py-2 px-4 rounded font-semibold text-base transition-colors duration-200 ${
            isActive
              ? 'bg-indigo-600 text-white'
              : 'text-gray-200 hover:bg-gray-700 hover:text-white'
          }`
        }
      >
        <FaTachometerAlt />
        <span>Admin Dashboard</span>
      </NavLink>

      {/* Nav links */}
      <nav className='flex flex-col space-y-2'>
        <NavLink to='/admin/users' className={navLinkClass}>
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink to='/admin/products' className={navLinkClass}>
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>

        <NavLink to='/admin/orders' className={navLinkClass}>
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink to='/admin/shop' className={navLinkClass}>
          <FaStore />
          <span>Shop</span>
        </NavLink>

        <div className='pt-6'>
          <button
            onClick={handleLogout}
            className='w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded
                       flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200'
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default AdminSidebar
