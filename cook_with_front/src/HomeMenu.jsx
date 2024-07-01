import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./HomeMenu.css"

function HomeMenu() {
  const navigate = useNavigate();

  return (
    <div className='HomeMenu'>
      <div className='home-title-block'>
        <p className="title">COOK_WITH</p>
        <p className="subtitle">作りたい料理レシピがすぐわかる！料理レシピ検索サイト</p>
      </div>
      <div className="menu-button-block">
        <button type="button"
          className="btn btn-outline-light menu-button" onClick={() => navigate('/nutrition')} to="/nutrition">欲しい栄養素で検索する</button>
        <button type="button"
          className="btn btn-outline-light menu-button" onClick={() => navigate('/ingredients')}>使いたい食材で検索する</button>
        <button type="button"
          className="btn btn-outline-light menu-button" onClick={() => navigate('/contact')}>お問い合わせ</button>
      </div>
    </div>
  )
}

export default HomeMenu