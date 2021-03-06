import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn, isAdmin}) => (
  <div>
    <h1>Brett's Beer Fridge</h1>
    <nav>
      {isLoggedIn ? (
        isAdmin ? (
          <div>
            {/* The navbar will show these links  if admin */}
            <Link to="/home">Home</Link>
            <Link to="/beers/page/1">See Beers</Link>
            <Link to="/addbeer">Add a Beer</Link>
            <Link to="/cart">See Cart</Link>
            <Link to="/orders">View Orders</Link>
            <a href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links after you log in */}
            <Link to="/home">Home</Link>

            <Link to="/orders">View Orders</Link>
            <Link to="/beers/page/1">See Beers</Link>
            <Link to="/cart">See Cart</Link>
            <a href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
        )
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/beers/page/1">See Beers</Link>
          <Link to="/cart">See Cart</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    isAdmin: state.user.userType === 'admin'
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
