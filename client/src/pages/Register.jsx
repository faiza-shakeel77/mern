import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Correct usage of useNavigate

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
      const newUser = response.data;

      if (!newUser) {
        setError("Couldn't register user. Please try again.");
      } else {
        console.log(newUser);
        navigate('/login'); // Navigate to home or login page after successful registration
      }
    } catch (err) {
      setError(err.response.data.message || 'Registration failed. Please try again.'); // Display error message from server response
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register_form" onSubmit={registerUser}>
          {error && <p className="form_error-message">{error}</p>}
          <input type="text" placeholder="Full Name" name="name" value={userData.name} onChange={changeInputHandler} autoFocus />
          <input type="text" placeholder="Email" name="email" value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder="Password" name="password" value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder="Confirm Password" name="confirmPassword" value={userData.confirmPassword} onChange={changeInputHandler} />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign in</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
