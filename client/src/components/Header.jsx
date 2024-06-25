import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import Logo from '../images/logo.png';
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import { UserContext } from '../context/userContext';

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle the search query submission logic here
    console.log('Search query:', searchQuery);
  };

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className='nav_logo' onClick={closeNavHandler}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>
        <form className="nav__search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {currentUser?.id && isNavShowing && (
          <ul className="nav_menu">
            <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
            <li><Link to="/share" onClick={closeNavHandler}>Create Post</Link></li>
            <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
            <li><Link to="/logout" onClick={closeNavHandler}>Logout</Link></li>
            <li><Link to="/Deleteaccount" onClick={closeNavHandler}>Deactivate</Link></li>
          </ul>
        )}
        {!currentUser?.id && isNavShowing && (
          <ul className="nav_menu">
            <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
            <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
          </ul>
        )}
        
        <button className="nav_toggle-btn" onClick={() => setIsNavShowing(!isNavShowing)}>
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
