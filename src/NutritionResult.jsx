import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './Result.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function NutritionResult() {
  const navigate = useNavigate();

  //検索結果情報の保存
  const [resultData, setResultData] = useState([]);

  //閲覧履歴の保存
  const [historyData, setLastClickedData] = useState(JSON.parse(localStorage.getItem('NutritionlastClickedData')) || []);

  //オヌヌメ情報の保存
  const [recommendData, setRecommendData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem('resultData'));
    if (storedData) {
      setResultData(storedData);
    }

    const lastClickedData = JSON.parse(localStorage.getItem('NutritionlastClickedData')) || [];
    if (Array.isArray(lastClickedData)) {
      setLastClickedData(lastClickedData);
    } else {
      setLastClickedData([]);
    }
  }, []);


  const handleLinkClick = (url, name, image_url) => {
    const newEntry = { url, name, image_url };
    let updatedHistory = [...historyData];

    // 既存のエントリを見つけて削除
    updatedHistory = updatedHistory.filter(item => item.url !== url);

    // 新しいエントリを先頭に追加し、リストを3つに制限
    updatedHistory = [newEntry, ...updatedHistory].slice(0, 3);

    setLastClickedData(updatedHistory);
    localStorage.setItem('NutritionlastClickedData', JSON.stringify(updatedHistory));
  };

  //imagelistのスタイル 
  const getImageDivStyles = (showResults) => {
    const isSmallScreen = window.innerWidth < 900;
    const isShow = (showResults == 'true');

    return {
        width: isSmallScreen ? '100vw' : '70vw',
        display: isSmallScreen && !isShow ? 'none' : null,
    };
};

const getImageListStyles = () => {
    return {
        height: resultData.length > 2 ? '80vh' : '100%',
    };
};

  const getHistoryRecommendListStyles = () => {
    const isSmallScreen = window.innerWidth < 900;

    return {
      width: isSmallScreen ? '45vw' : '20vw',
      height: isSmallScreen ? '70vh' : '40vh'
    };
  };

  const getHistoryRecommendDivStyles = (showResults) => {
    const isSmallScreen = window.innerWidth < 900;
    const isShow = (showResults == 'true');

    return {
      display: isSmallScreen ? (isShow ? 'none' : 'flex') : 'block',
      width: isSmallScreen ? '100vw' : 'auto',
      justifyContent: isSmallScreen ? 'space-evenly' : 'initial',
      padding: isSmallScreen ? '1.5rem' : null
    };
  };

  //おすすめレシピデータの取得
  useEffect(() => {
    const sendDataToPython = async (data) => {
      try {
        const response = await fetch('https://cw.pythonanywhere.com/api/nutrition_history_submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          setRecommendData(result.output_data);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    sendDataToPython(historyData);
  }, [historyData]);

  // 表示切替の状態管理(スマホ版)
  const [showResults, setShowResults] = useState('true');

  const handleToggle = (event, newValue) => {
    if (newValue !== null) {
      setShowResults(newValue);
    }
  };

  return (
    <div className="NutritionResult" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div id='header' className='p-2' style={{ display: 'flex', alignItems: 'stretch' }}>
        <img src="./img/COOK_WITH_transparent_black.png" alt="COOK_WITH icon" id='cook-with-icon' style={{ height: '100%', objectFit: 'cover' }}/>
        <Header />
      </div>
      {window.innerWidth < 900 && (
        <div className="toggle-container" style={{ width: '100vw', display: 'flex', justifyContent: 'space-evenly' }}>
          <ToggleButtonGroup
            color="primary"
            value={showResults}
            exclusive
            onChange={handleToggle}
            aria-label="Platform"
          >
            <ToggleButton value="true">検索結果</ToggleButton>
            <ToggleButton value="false">履歴/おすすめ</ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
      <div className="ans_element d-flex flex-row" style={{ flexGrow: '1', justifyContent: 'space-around' }}>
        <div className='display-result' style={getImageDivStyles(showResults)}>
          {resultData.length > 0 ? (
            <ImageList id='resultData' cols={2} sx={getImageListStyles()}>
              <ImageListItem key="Subheader" cols={2}>
                <ListSubheader component="div">検索結果</ListSubheader>
              </ImageListItem>
              {resultData.map((item) => {
                const itemId = item["url"]; // ユニークなIDを取得
                return (
                  <ImageListItem key={itemId}>
                    <a href={item["url"]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item["url"], item["name"], item["image_url"])}>
                      <img
                        srcSet={`${item["image_url"]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item["image_url"]}?w=248&fit=crop&auto=format`}
                        alt={item["name"]}
                        loading="lazy"
                        style={{ width: '100%' }}
                      />
                    </a>
                    <ImageListItemBar
                      title={
                        <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <a href={item["url"]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item["url"], item["name"], item["image_url"])} style={{ color: "#ffffff" }} >
                            {item["name"]}
                          </a>
                        </Typography>
                      }
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          ) : (
            <div style={{ marginTop: '40px', textAlign: 'center' }}>条件に合うレシピは見つかりませんでした</div>
          )}
        </div>
        <div style={getHistoryRecommendDivStyles(showResults)}>
          {historyData.length > 0 ? (
            <ImageList sx={getHistoryRecommendListStyles()} cols={1} id='historyData'>
              <ImageListItem key="Subheader-history">
                <ListSubheader component="div">閲覧履歴</ListSubheader>
              </ImageListItem>
              {historyData.map((item) => {
                const itemId = item["url"]; // ユニークなIDを取得

                return (
                  <ImageListItem key={itemId}>
                    <a href={item["url"]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item["url"], item["name"], item["image_url"])}>
                      <img
                        srcSet={`${item["image_url"]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item["image_url"]}?w=248&fit=crop&auto=format`}
                        alt={item["name"]}
                        loading="lazy"
                        style={{ width: '100%' }}
                      />
                    </a>
                    <ImageListItemBar
                      title={
                        <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <a href={item["url"]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item["url"], item["name"], item["image_url"])} style={{ color: "#ffffff" }} >
                            {item["name"]}
                          </a>
                        </Typography>
                      }
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          ) : (
            <div style={{ width: window.innerWidth < 900 ? '45vw' : '20vw', textAlign: 'center', marginTop: '50px'}}>履歴がありません</div>
          )}
          {recommendData.length > 0 ? (
            <ImageList sx={getHistoryRecommendListStyles()} style={{ marginTop: window.innerWidth < 900 ? '0' : '2vh' }} cols={1} id='historyData'>
              <ImageListItem key="Subheader-recommend">
                <ListSubheader component="div">おすすめのレシピ</ListSubheader>
              </ImageListItem>
              {recommendData.map((item) => {
                const itemId = item["url"]; // ユニークなIDを取得

                return (
                  <ImageListItem key={itemId}>
                    <a href={item["url"]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item["url"], item["name"], item["image_url"])}>
                      <img
                        srcSet={`${item["image_url"]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item["image_url"]}?w=248&fit=crop&auto=format`}
                        alt={item["name"]}
                        loading="lazy"
                        style={{ width: '100%' }}
                      />
                    </a>
                    <ImageListItemBar
                      title={
                        <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <a href={item["url"]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item["url"], item["name"], item["image_url"])} style={{ color: "#ffffff" }} >
                            {item["name"]}
                          </a>
                        </Typography>
                      }
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          ) : (
            <div style={{ width: window.innerWidth < 900 ? '45vw' : '20vw', textAlign: 'center', marginTop: '50px' }}>おすすめがありません</div>
          )}
        </div>
      </div>
      <button type="button" id='back-button' className="btn btn-outline-dark align-items-center m-3" onClick={() => navigate('/nutrition')} style={{ width: '100px', justifyContent: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left me-2" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
        </svg>
        戻る
      </button>
      <Footer />
    </div>
  );
}

export default NutritionResult;