import React from 'react'
import HomeSwiper from "./HomeSwiper.jsx"
import HomeMenu from "./HomeMenu.jsx"


const Home = ({ setPage }) =>{
  return (
    <div className='Home'>
        <HomeSwiper/>
        <HomeMenu setPage={setPage} className=""/>
    </div>
  )
}

export default Home;