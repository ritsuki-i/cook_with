import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { textDecoration } from '@chakra-ui/react';

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

    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem('resultData'));
        console.log(storedData)
        if (storedData) {
            setResultData(storedData);
        }
    }, []);

    return (
        <div className="IngredientsResult">
            <Header />
            <div className="ans_element">
                <ImageList sx={{ width: '70vw', height: '80vh' }}>

                    {resultData.map((item) => {
                        const itemId = item[0]; // ユニークなIDを取得
                        const open = Boolean(anchorEls[itemId]);
                        const anchorEl = anchorEls[itemId];
                        const id = open ? `popover-${itemId}` : undefined;

                        return (
                            <ImageListItem key={itemId}>
                                <a href={item[0]} target="_blank" rel="noopener noreferrer">
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
                                            <a href={item[0]} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff"  }}>
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
            </div>
            <button type="button" class="btn btn-outline-dark" onClick={() => navigate('/ingredients')}>戻る</button>
            <Footer />
        </div>
    );
}

export default IngredientsResult