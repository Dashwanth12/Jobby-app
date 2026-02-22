import { NavLink, Navigate } from 'react-router-dom'
import './index.css'
import Cookies from 'js-cookie'

const Header = () => {

    const onClickLogout = () => {
        Cookies.remove('jwt_token')
        return <Navigate to='/login' />
    }

    return (
        <nav className="nav-header">
            <NavLink to='/'>
                <img
                    src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                    alt="website logo"
                    className="nav-header-logo"
                />
            </NavLink>
            <ul className="nav-header-menu">
                <li>
                    <NavLink
                        to="/"
                        className={({isActive}) => 
                            isActive 
                             ? 'nav-header-menu-item active'
                            : 'nav-header-menu-item'

                        }
                        
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/jobs"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-header-menu-item active'
                                : 'nav-header-menu-item'
                        }
                    >
                        Jobs
                    </NavLink>
                </li>
            </ul>
            <button type="button" className="logout-btn" onClick={onClickLogout} >Logout</button>
        </nav>
    )
}

export default Header
