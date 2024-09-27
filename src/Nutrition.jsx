import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nutrition.css'
import useCheckConnection from './useCheckConnection.js';

function Nutrition() {
  const navigate = useNavigate();

  const [nutritions, setNutritions] = useState([]);
  const url = 'https://cw.pythonanywhere.com';

  //サーバー接続テスト
  useCheckConnection(url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + '/api/nutrition_home/nutrition_data');
        const data = await response.json();
        setNutritions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [WantMost, setWantMost] = useState(sessionStorage.getItem('WantMost') || '');
  const [WantSecond, setWantSecond] = useState(sessionStorage.getItem('WantSecond') || '');
  const [WantThird, setWantThird] = useState(sessionStorage.getItem('WantThird') || '');
  const [DisplayMethod, setDisplayMethod] = useState(sessionStorage.getItem('DisplayMethod') || '');

  const handleWantMostChange = (event) => {
    setWantMost(event.target.value);
  };
  const handleWantSecondChange = (event) => {
    setWantSecond(event.target.value);
  };
  const handleWantThirdChange = (event) => {
    setWantThird(event.target.value);
  };
  const handleDisplayMethodChange = (event) => {
    setDisplayMethod(event.target.value);
  };

  //入力情報の保存
  useEffect(() => {
    sessionStorage.setItem('WantMost', WantMost);
    sessionStorage.setItem('WantSecond', WantSecond);
    sessionStorage.setItem('WantThird', WantThird);
    sessionStorage.setItem('DisplayMethod', DisplayMethod);
  }, [WantMost, WantSecond, WantThird, DisplayMethod]);

  //入力情報のリセット
  const StorageReset = () => {
    setWantMost('');
    setWantSecond('');
    setWantThird('');
    setDisplayMethod('');

    sessionStorage.setItem('WantMost', '');
    sessionStorage.setItem('WantSecond', '');
    sessionStorage.setItem('WantThird', '');
    sessionStorage.setItem('DisplayMethod', '');
  };


  //検索結果情報の保存
  const ResultData = JSON.parse(sessionStorage.getItem('resultData')) || [];
  const [SubmitAns, setAnser] = React.useState(ResultData);
  useEffect(() => {
    sessionStorage.setItem('resultData', JSON.stringify(SubmitAns));
  }, [SubmitAns]);

  const [PageChangeFlag, setPageChangeFlag] = React.useState(0);
  useEffect(() => {
    if (PageChangeFlag === 1) {
      navigate('/nutrition-result');
    }
  }, [SubmitAns, navigate, PageChangeFlag]);

  //Python側へ送信
  const handleSubmit = async () => {

    let wantMost = WantMost;
    let wantSecond = WantSecond;
    let wantThird = WantThird;
    let displayMethod = DisplayMethod;

    if (wantMost == '') {
      wantMost = 'nan';
    }
    if (wantSecond == '') {
      wantSecond = 'nan';
    }
    if (wantThird == '') {
      wantThird = 'nan';
    }
    if (displayMethod == '') {
      displayMethod = 'random';
    }

    const data = {
      wantMost,
      wantSecond,
      wantThird,
      displayMethod
    };

    try {
      const response = await fetch('https://cw.pythonanywhere.com/api/nutrition_food_submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        setAnser(result['output_data']);
        setPageChangeFlag(1);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const PageDown = async () => {
    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  //タイトルのスタイルの変更
  const titleColorChangeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [transformTitleWidth, setTransformTitleWidth] = useState(0);
  const [transformSubtitleWidth, setTransformSubtitleWidth] = useState(0);
  const [transformSubtitleHeight, setTransformSubtitleHeight] = useState(0);

  useEffect(() => {
    const titleColorChangeWidth = JSON.stringify(titleColorChangeRef.current.getBoundingClientRect().width);
    const subtitleColorChangeWidth = JSON.stringify(titleColorChangeRef.current.getBoundingClientRect().width);
    const subtitleColorChangeHeight = JSON.stringify(titleColorChangeRef.current.getBoundingClientRect().height);

    setTransformTitleWidth(-titleColorChangeWidth);
    setTransformSubtitleWidth(-subtitleColorChangeWidth);
    setTransformSubtitleHeight(subtitleColorChangeHeight);
  }, []);

  return (
    <div className='Nutrition'>
      <div id='nut-title' className='min-vh-100 bg-white'>
        <div className="nut-container">
          <div className="nut-image-container">
            <img src={`${process.env.PUBLIC_URL}/img/nutrition_title_img.webp`} alt="Nutrition Title" className="nut-image" style={{
              filter: 'drop-shadow(8px 8px 9px rgba(0,0,0,0.6))'
            }} />
          </div>
          <div className="nut-text-container">
            <h1 id='title' ref={titleRef} style={{ transform: `translateX(${transformTitleWidth}px)`, textShadow: '5px 4px 3px rgba(0, 0, 0, 0.39)' }}><span className='text-white' id='title-color-change' ref={titleColorChangeRef}>CO</span>OK_WITH</h1>
            <p
              id='subtitle'
              ref={subtitleRef}
              style={{
                transform: `translate(${transformSubtitleWidth}px, ${transformSubtitleHeight}px)`,
                textShadow: '5px 4px 3px rgba(0, 0, 0, 0.39)'
              }}
            >
              <span className='text-white' id='subtitle-color-change' ref={subtitleRef}>栄養素</span>から広がる美食の世界。
            </p>
          </div>
        </div>
        <div id='header' className='d-inline-flex p-2'>
          <img src={`${process.env.PUBLIC_URL}/img/COOK_WITH_transparent_black.png`} alt="COOK_WITH icon" id='cook-with-icon' />
          <Header />
        </div>
        <button type="button" className="btn btn-outline-dark" id='view-button' onClick={PageDown}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </div>
      <div id='nut-title-smartphone' className='min-vh-100 bg-white' style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/nutrition_title_smartphone_img.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}>
        <div className="nut-container-smartphone">
          <div className="nut-text-container-smartphone">
            <h1 id='title-smartphone' style={{ textShadow: '5px 4px 3px rgba(0, 0, 0, 0.39)' }}>COOK_WITH</h1>
            <p id='subtitle-smartphone' style={{ textShadow: '5px 4px 3px rgba(0, 0, 0, 0.39)' }}>栄養素から広がる美食の世界。</p>
          </div>
        </div>
        <div id='header' className='d-inline-flex p-2'>
          <img src={`${process.env.PUBLIC_URL}/img/COOK_WITH_transparent_white.png`} alt="COOK_WITH icon" id='cook-with-icon' />
          <Header />
        </div>
        <button type="button" className="btn btn-outline-dark" id='view-button' onClick={PageDown}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-short" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
          </svg>
        </button>
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'serif' }}>
        <Card sx={{ minWidth: '50vw', minHeight: '85vh', padding: 2, boxShadow: 3, position: 'relative' }}>
          <CardContent>
            <div className='mb-5' id='card-title'>
              <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                料理レシピ検索
              </Typography>
              <button type="button" className="btn btn-outline-dark ms-auto" onClick={StorageReset} id='reset-btn'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-backspace-reverse" viewBox="0 0 16 16">
                  <path d="M9.854 5.146a.5.5 0 0 1 0 .708L7.707 8l2.147 2.146a.5.5 0 0 1-.708.708L7 8.707l-2.146 2.147a.5.5 0 0 1-.708-.708L6.293 8 4.146 5.854a.5.5 0 1 1 .708-.708L7 7.293l2.146-2.147a.5.5 0 0 1 .708 0z" />
                  <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.08a2 2 0 0 0 1.519-.698l4.843-5.651a1 1 0 0 0 0-1.302L10.6 1.7A2 2 0 0 0 9.08 1H2zm7.08 1a1 1 0 0 1 .76.35L14.682 8l-4.844 5.65a1 1 0 0 1-.759.35H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7.08z" />
                </svg>&nbsp;検索条件をリセット
              </button>
            </div>
            <Box sx={{ mb: 2 }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                <InputLabel id="want-most-select" sx={{ fontFamily: 'serif' }}>一番摂取したい栄養素</InputLabel>
                <Select
                  labelId="want-most-select"
                  id="want-most-select"
                  value={WantMost}
                  onChange={handleWantMostChange}
                  sx={{ fontFamily: 'serif' }}
                >
                  {Object.entries(nutritions).map(([key, value]) => (
                    <MenuItem key={key} value={key} sx={{ fontFamily: 'serif' }}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                <InputLabel id="want-second-select" sx={{ fontFamily: 'serif' }}>二番目に摂取したい栄養素</InputLabel>
                <Select
                  labelId="want-second-select"
                  id="want-second-select"
                  value={WantSecond}
                  onChange={handleWantSecondChange}
                  sx={{ fontFamily: 'serif' }}
                >
                  {Object.entries(nutritions).map(([key, value]) => (
                    <MenuItem key={key} value={key} sx={{ fontFamily: 'serif' }}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                <InputLabel id="want-third-select" sx={{ fontFamily: 'serif' }}>三番目に摂取したい栄養素</InputLabel>
                <Select
                  labelId="want-third-select"
                  id="want-third-select"
                  value={WantThird}
                  onChange={handleWantThirdChange}
                  sx={{ fontFamily: 'serif' }}
                >
                  {Object.entries(nutritions).map(([key, value]) => (
                    <MenuItem key={key} value={key} sx={{ fontFamily: 'serif' }}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                <InputLabel id="display-method-select" sx={{ fontFamily: 'serif' }}>検索方法</InputLabel>
                <Select
                  labelId="display-method-select"
                  id="display-method-select"
                  value={DisplayMethod}
                  onChange={handleDisplayMethodChange}
                  sx={{ fontFamily: 'serif' }}
                >
                  <MenuItem key="random" value="random" sx={{ fontFamily: 'serif' }}>ランダム</MenuItem>
                  <MenuItem key="sort1" value="sort1" sx={{ fontFamily: 'serif' }}>栄養価割合(降順)</MenuItem>
                  <MenuItem key="sort2" value="sort2" sx={{ fontFamily: 'serif' }}>栄養素量実数値(降順)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-outline-dark m-auto" onClick={handleSubmit}>検索</button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </div>
  )
}

export default Nutrition