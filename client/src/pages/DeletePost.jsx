import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { Link,useNavigate, useLocation} from 'react-router-dom'
import Loader from '../components/Loader';
import axios from 'axios';
const DeletePost =({postId : id}) => {

    const navigate = useNavigate();
    const location = useLocation()
    const [isLoading,setIsLoading]= useState(false)

    const {currentUser} = useContext(UserContext)
    const token = currentUser?.token;
  
    //redirect to login page for any user who isnt logged in
    useEffect(() => {
   if(!token) {
     navigate('/login')
   }
    },[])

    const removePost = async () => {
      setIsLoading(true)
      try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
        if(response.status == 200) {
          if(location.pathname == `/myposts/${currentUser.id}`) {
            navigate(0)
          } else {
            navigate('/')
          }
        }
        setIsLoading(false)
    } catch (error) {
      console.log("couldn't delete post.")
    }
    }
    if(isLoading) {
      return <Loader/>
    }
  
    return(
      <Link className = 'btn sm danger'onClick={() => removePost(id)}>Delete</Link>
    )
}
export default DeletePost