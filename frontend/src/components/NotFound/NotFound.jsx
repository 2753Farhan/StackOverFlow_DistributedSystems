import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
        <section className=''>
          <div className="">
            <img src="/notfound.png" alt="notfound" />
            <Link to={'/'}>RETURN TO HOME PAGE</Link>
          </div>
        </section>
    </>
  )
}

export default NotFound
