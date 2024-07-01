import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Nutrition() {

  const navigate = useNavigate();

  const [nutritions, setNutritions] = useState([]);
  const url = 'http://127.0.0.1:5000';

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
      const response = await fetch('http://127.0.0.1:5000/api/nutrition_food_submit', {
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

  return (
    <div className='Nutrition'>
      <Header />
      <Box sx={{ minWidth: '30vw' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: '30vw' }}>
          <InputLabel id="want-most-select">一番摂取したい栄養素</InputLabel>
          <Select
            labelId="want-most-select"
            id="want-most-select"
            value={WantMost}
            onChange={handleWantMostChange}
          >
            {Object.entries(nutritions).map(([key, value]) => (
              <MenuItem key={key} value={key}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: '30vw' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: '30vw' }}>
          <InputLabel id="want-second-select">二番目に摂取したい栄養素</InputLabel>
          <Select
            labelId="want-second-select"
            id="want-second-select"
            value={WantSecond}
            onChange={handleWantSecondChange}
          >
            {Object.entries(nutritions).map(([key, value]) => (
              <MenuItem key={key} value={key}>{value}</MenuItem>
            ))}
          </Select>

        </FormControl>
      </Box>
      <Box sx={{ minWidth: '30vw' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: '30vw' }}>
          <InputLabel id="want-third-select">三番目に摂取したい栄養素</InputLabel>
          <Select
            labelId="want-third-select"
            id="want-third-select"
            value={WantThird}
            onChange={handleWantThirdChange}
          >
            {Object.entries(nutritions).map(([key, value]) => (
              <MenuItem key={key} value={key}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: '30vw' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: '30vw' }}>
          <InputLabel id="display-method-select">検索方法</InputLabel>
          <Select
            labelId="display-method-select"
            id="display-method-select"
            value={DisplayMethod}
            onChange={handleDisplayMethodChange}
          >
            <MenuItem key="random" value="random" selected>ランダム</MenuItem>
            <MenuItem key="sort1" value="sort1">栄養価割合(降順)</MenuItem>
            <MenuItem key="sort2" value="sort2">栄養素量実数値(降順)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div>
        <button type="button" className="btn btn-outline-dark" onClick={handleSubmit}>検索</button>
        <button type="button" className="btn btn-outline-dark" onClick={StorageReset}>リセット</button>
      </div>
      <Footer />
    </div>
  )
}

export default Nutrition