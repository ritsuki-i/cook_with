import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Header from './Header.jsx'
import Footer from './Footer.jsx';

function IngredientsResult() {
  const navigate = useNavigate();

  //検索結果情報の保存
  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem('resultData'));
    console.log(storedData)
    if (storedData) {
      setResultData(storedData);
    }
  }, []);

  return (
    <div className="NutritionResult">
      <Header/>
      <div className="ans_element">
        <ImageList sx={{ width: '70vw', height: '80vh' }}>

          {resultData.map((item) => {
            const itemId = item["url"]; // ユニークなIDを取得

            return (
              <ImageListItem key={itemId}>
                <a href={item["url"]} target="_blank" rel="noopener noreferrer">
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
                        <a href={item["url"]} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff"  }}>
                            {item["name"]}
                        </a>
                    </Typography>
                }
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      </div>
      <button type="button" class="btn btn-outline-dark" onClick={() => navigate('/nutrition')}>戻る</button>
      <Footer />
    </div>
  );
}

export default IngredientsResult