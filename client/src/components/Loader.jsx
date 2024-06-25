import React from 'react'
import LoadingGif from '../images/avatar5.jpg'
const Loader = () => {
  return (
    <div className='loader'>
        <div className="loader_image">
            <img src={LoadingGif} alt=""/>
        </div>
    </div>
  )
}

export default Loader