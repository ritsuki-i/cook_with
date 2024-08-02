import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./HomeMenu.css"

function HomeMenu() {
  const navigate = useNavigate();

  return (
    <div className='HomeMenu'>
      <div className='home-title-block'>
        <p className="title" style={{
          textShadow: '5px 4px 3px rgba(255, 255, 255, 0.5)'
        }}>COOK_WITH</p>
        <p className="subtitle" style={{
          textShadow: '5px 4px 3px rgba(255, 255, 255, 1)'
        }}>作りたい料理レシピがすぐわかる！料理レシピ検索サイト</p>
      </div>
      <div className="menu-button-block">
        <button type="button"
          className="btn btn-outline-light menu-button" onClick={() => navigate('/nutrition')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)' }}>欲しい栄養素で検索する</button>
        <button type="button"
          className="btn btn-outline-light menu-button" onClick={() => navigate('/ingredients')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)' }}>使いたい食材で検索する</button>
        <button type="button"
          className="btn btn-outline-light menu-button" onClick={() => navigate('/contact')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)' }}>お問い合わせ</button>
      </div>
    </div>
  )
}

export default HomeMenu