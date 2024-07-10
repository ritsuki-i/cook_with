import React from 'react';
import HomeSwiper from "./HomeSwiper.jsx"
import HomeMenu from "./HomeMenu.jsx"
import useCheckConnection from './useCheckConnection.js';


const Home = ({ setPage }) =>{
  //サーバー接続テスト
  const url = 'https://cw.pythonanywhere.com';
  useCheckConnection(url);


  return (
    <div className='Home'>
        <HomeSwiper/>
        <HomeMenu setPage={setPage} className=""/>
    </div>
  )
}

export default Home;