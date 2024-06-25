import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <u1 className="footer_categories">
        <li><Link to="/posts/categories/Kindergarten">Kindergarten</Link></li>
        <li><Link to="/posts/categories/Primary School">Primary School</Link></li>
        <li><Link to="/posts/categories/Junior School">Junior School</Link></li>
        <li><Link to="/posts/categories/Secondary School">Secondary School</Link></li>
        <li><Link to="/posts/categories/High School">High School</Link></li>
        
        
      </u1>
     <div className="footer_copyright">
      <small>All Rights Reserved &copy: Copyright, Faiza Shakeel.</small>

     </div>
    </footer>
  )
}

export default Footer