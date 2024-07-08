import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Result.css'

function IngredientsResult() {
    const navigate = useNavigate();

    const [anchorEls, setAnchorEls] = useState({});

    const handleClick = (event, id) => {
        setAnchorEls((prev) => ({
            ...prev,
            [id]: event.currentTarget,
        }));
    };

    const handleClose = (id) => {
        setAnchorEls((prev) => ({
            ...prev,
            [id]: null,
        }));
    };

    //検索結果情報の保存
    const [resultData, setResultData] = useState([]);

    //オヌヌメ情報の保存
    const [recommendData, setRecommendData] = useState([]);

    //閲覧履歴の保存
    const [historyData, setLastClickedData] = useState(JSON.parse(localStorage.getItem('IngredientslastClickedData')) || []);

    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem('resultData'));
        if (storedData) {
            setResultData(storedData);
        }

        const lastClickedData = JSON.parse(localStorage.getItem('IngredientslastClickedData')) || [];
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
        localStorage.setItem('IngredientslastClickedData', JSON.stringify(updatedHistory));
        console.log(updatedHistory);
    };


    const getImageListStyles = () => {
        return {
            width: '70vw',
            height: resultData.length > 2 ? '80vh' : '100%',
        };
    };

    const getHistoryListStyles = () => {
        return {
            width: '20vw',
            height: '39vh',
        };
    };

    const getRecommendListStyles = () => {
        return {
            width: '20vw',
            height: '39vh'
        };
    };

    //おすすめレシピデータの取得
    useEffect(() => {
        const sendDataToPython = async (data) => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/ingredients_history_submit', {
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

    return (
        <div className="IngredientsResult">
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
                            const itemId = item[0]; // ユニークなIDを取得
                            const open = Boolean(anchorEls[itemId]);
                            const anchorEl = anchorEls[itemId];
                            const id = open ? `popover-${itemId}` : undefined;

                            return (
                                <ImageListItem key={itemId}>
                                    <a href={item[0]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item[0], item[1], item[2])}>
                                        <img
                                            srcSet={`${item[2]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${item[2]}?w=248&fit=crop&auto=format`}
                                            alt={item[1]}
                                            loading="lazy"
                                            style={{ width: '100%' }}
                                        />
                                    </a>
                                    <ImageListItemBar
                                        title={
                                            <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                <a href={item[0]} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item[0], item[1], item[2])} style={{ color: "#ffffff" }}>
                                                    {item[1]}
                                                </a>
                                            </Typography>
                                        }
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)', zIndex: 1 }}
                                                aria-label={`info about ${item[0]}`}
                                                aria-describedby={id}
                                                onClick={(event) => handleClick(event, itemId)}
                                            >
                                                <InfoIcon />
                                            </IconButton>
                                        }
                                    />
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={() => handleClose(itemId)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Typography sx={{ p: 2 }}>
                                            レビュー評価: {item[3] == -1 ? 'NaN' : item[3]}<br />
                                            調理時間: {item[4]}分<br />
                                            費用: {item[5]}円
                                        </Typography>
                                    </Popover>
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                ) : (
                    <div style={{ width: '70vw', textAlign: 'center' }}>条件に合うレシピは見つかりませんでした</div>
                )}
                <div style={{ marginRight: '3vw' }}>
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
                        <div style={{ width: '20vw', textAlign: 'center' }}>履歴がありません</div>
                    )}
                    {recommendData.length > 0 ? (
                        <ImageList sx={getRecommendListStyles()} style={{ marginTop: '2vh' }} cols={1} id='historyData'>
                            <ImageListItem key="Subheader">
                                <ListSubheader component="div">あなたへのおすすめ</ListSubheader>
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
                        <div style={{ width: '20vw', textAlign: 'center' }}>おすすめがありません</div>
                    )}
                </div>
            </div>
            <button type="button" id='back-button' className="btn btn-outline-dark d-flex align-items-center m-3" onClick={() => navigate('/ingredients')}>
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

export default IngredientsResult