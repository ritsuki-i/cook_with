import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography';
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
    console.log(updatedHistory);
  };

  //imagelistのスタイル 
  const getImageListStyles = () => {
    return {
      width: '70vw',
      height: resultData.length > 2 ? '70vh' : '100%',
    };
  };

  const getHistoryListStyles = () => {
    return {
      width: '20vw',
      height: historyData.length > 2 ? '70vh' : '100%',
    };
  };

  return (
    <div className="NutritionResult">
      <div id='header' className='d-inline-flex p-2'>
        <img src="./img/COOK_WITH_transparent_black.png" alt="COOK_WITH icon" id='cook-with-icon' />
        <Header />
      </div>
      <div className="ans_element d-flex flex-row">
        {resultData.length > 0 ? (
          <ImageList sx={getImageListStyles()} className='p-4' id='resultData'>
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
          <p>条件に合うレシピは見つかりませんでした</p>
        )}
        {historyData.length > 0 ? (
          <ImageList sx={getHistoryListStyles()} cols={1} id='historyData'>
            <ImageListItem key="Subheader">
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
          <div>履歴がありません</div>
        )}
      </div>
      <button type="button" id='back-button' className="btn btn-outline-dark d-flex align-items-center m-3" onClick={() => navigate('/nutrition')}>
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