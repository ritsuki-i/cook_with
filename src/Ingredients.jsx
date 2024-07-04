import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodSelect from "./FoodSelect.jsx";
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Rating from '@mui/material/Rating';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Header from './Header.jsx'
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Ingradients.css'

const MAX_min = 180;
const MIN_min = 10;
const marks_time = [
    {
        value: MIN_min,
        label: '',
    },
    {
        value: MAX_min,
        label: '',
    },
];

const MAX_cost = 1000;
const MIN_cost = 100;
const marks_cost = [
    {
        value: MIN_cost,
        label: '',
    },
    {
        value: MAX_cost,
        label: '',
    },
];


function Ingredients() {

    const FoodSelectRef = useRef();
    const navigate = useNavigate();

    const [keywordChecked, setKeywordChecked] = useState(() => JSON.parse(sessionStorage.getItem('keywordChecked')) || false);
    const [cooktimeChecked, setCooktimeChecked] = useState(() => JSON.parse(sessionStorage.getItem('cooktimeChecked')) || false);
    const [reviewChecked, setReviewChecked] = useState(() => JSON.parse(sessionStorage.getItem('reviewChecked')) || false);
    const [val_review, setValReview] = useState(() => JSON.parse(sessionStorage.getItem('val_review')) || 0);
    const [costChecked, setCostChecked] = useState(() => JSON.parse(sessionStorage.getItem('costChecked')) || false);
    const [selectedFood, setSelectedFood] = useState(() => JSON.parse(sessionStorage.getItem('selectedFood')) || []);
    const [val_time, setValTime] = useState(() => JSON.parse(sessionStorage.getItem('val_time')) || 0);
    const [val_cost, setValCost] = useState(() => JSON.parse(sessionStorage.getItem('val_cost')) || 0);
    const [upDownToggle, setUpDownToggle] = useState(() => JSON.parse(sessionStorage.getItem('upDownToggle')) || '0');
    const [serchedFilter, setSearchedFilter] = useState(() => JSON.parse(sessionStorage.getItem('serchedFilter')) || '');

    //入力情報の保存
    useEffect(() => {
        sessionStorage.setItem('keywordChecked', JSON.stringify(keywordChecked));
        sessionStorage.setItem('cooktimeChecked', JSON.stringify(cooktimeChecked));
        sessionStorage.setItem('reviewChecked', JSON.stringify(reviewChecked));
        sessionStorage.setItem('val_review', JSON.stringify(val_review));
        sessionStorage.setItem('costChecked', JSON.stringify(costChecked));
        sessionStorage.setItem('selectedFood', JSON.stringify(selectedFood));
        sessionStorage.setItem('val_time', JSON.stringify(val_time));
        sessionStorage.setItem('val_cost', JSON.stringify(val_cost));
        sessionStorage.setItem('upDownToggle', JSON.stringify(upDownToggle));
        sessionStorage.setItem('serchedFilter', JSON.stringify(serchedFilter));
    }, [keywordChecked, cooktimeChecked, reviewChecked, val_review, val_review, costChecked, selectedFood, val_time, val_cost, upDownToggle, serchedFilter]);

    //入力情報のリセット
    const StorageReset = () => {
        setKeywordChecked(false);
        setCooktimeChecked(false);
        setReviewChecked(false);
        setValReview(0);
        setCostChecked(false);
        setValTime(0);
        setValCost(0);
        setUpDownToggle('0');
        setSearchedFilter('');

        sessionStorage.setItem('keywordChecked', JSON.stringify(false));
        sessionStorage.setItem('cooktimeChecked', JSON.stringify(false));
        sessionStorage.setItem('reviewChecked', JSON.stringify(false));
        sessionStorage.setItem('val_review', JSON.stringify(0));
        sessionStorage.setItem('costChecked', JSON.stringify(false));
        sessionStorage.setItem('val_time', JSON.stringify(0));
        sessionStorage.setItem('val_cost', JSON.stringify(0));
        sessionStorage.setItem('upDownToggle', JSON.stringify('0'));
        sessionStorage.setItem('serchedFilter', JSON.stringify(''));

        //子要素のfoodSelect削除
        if (FoodSelectRef.current) {
            FoodSelectRef.current.clearSelection();
        }
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
            navigate('/ingredients-result');
        }
    }, [SubmitAns, navigate, PageChangeFlag]);


    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        switch (id) {
            case 'keyword':
                setKeywordChecked(checked);
                break;
            case 'cooktime':
                setCooktimeChecked(checked);
                break;
            case 'review':
                setReviewChecked(checked);
                break;
            case 'cost':
                setCostChecked(checked);
                break;
            default:
                break;
        }
    };

    //food情報の保存
    const handleFoodDataChange = (data) => {
        setSelectedFood(data);
    };

    //レビューのslider情報
    const handleReviewChange = (_, newValue) => {
        setValReview(newValue);
    };

    //調理時間のslider情報
    const handleTimeChange = (_, newValue) => {
        setValTime(newValue);
    };

    //調理費用のslider情報
    const handleCostChange = (_, newValue) => {
        setValCost(newValue);
    };

    //以下以上のトグル
    const handleUpDownChange = (event, newUpDownToggle) => {
        setUpDownToggle(newUpDownToggle);
    };

    //フィルター検索の取得
    const handleSearchedFilterChange = (event) => {
        setSearchedFilter(event.target.value);
    };

    //Python側へ送信
    const handleSubmit = async () => {
        const data = {
            keywordChecked,
            cooktimeChecked,
            reviewChecked,
            costChecked,
            selectedFood,
            val_time,
            val_cost,
            val_review,
            upDownToggle,
            serchedFilter
        };

        try {
            const response = await fetch('https://cw.pythonanywhere.com/api/ingredients_food_submit', {
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

    return (
        <div className="Ingredients">
            <div id='ing-title' className='min-vh-100 bg-black'>
                <div className="ing-container">
                    <div className="ing-image-container">
                        <img src="./img/ingradient_title_img.png" alt="Ingradients Title" className="ing-image" />
                    </div>
                    <div className="ing-text-container text-white">
                        <h1>COOK_WITH</h1>
                        <p>手持ちの食材から、あなたの食卓に彩りを。</p>
                    </div>
                </div>
                <div id='header' className='d-inline-flex p-2'>
                    <img src="./img/COOK_WITH_transparent_white.png" alt="COOK_WITH icon" id='cook-with-icon' />
                    <Header className="invert-colors" />
                </div>
                <button type="button" class="btn btn-outline-dark invert-colors" id='view-button' onClick={PageDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                    </svg>
                </button>
            </div>
            <div className="search_element">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'serif' }}>
                    <Card sx={{ minWidth: '50vw', minHeight: '70vh', padding: 2, boxShadow: 3, position: 'relative' }}>
                        <CardContent>
                            <div className='d-flex mb-5'>
                                <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                                    料理レシピ検索
                                </Typography>
                                <button type="button" className="btn btn-outline-dark ms-auto" onClick={StorageReset}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-backspace-reverse" viewBox="0 0 16 16">
                                        <path d="M9.854 5.146a.5.5 0 0 1 0 .708L7.707 8l2.147 2.146a.5.5 0 0 1-.708.708L7 8.707l-2.146 2.147a.5.5 0 0 1-.708-.708L6.293 8 4.146 5.854a.5.5 0 1 1 .708-.708L7 7.293l2.146-2.147a.5.5 0 0 1 .708 0z" />
                                        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7.08a2 2 0 0 0 1.519-.698l4.843-5.651a1 1 0 0 0 0-1.302L10.6 1.7A2 2 0 0 0 9.08 1H2zm7.08 1a1 1 0 0 1 .76.35L14.682 8l-4.844 5.65a1 1 0 0 1-.759.35H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7.08z" />
                                    </svg>&nbsp;検索条件をリセット
                                </button>
                            </div>
                            <Box sx={{ mb: 2 }}>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                                    <Typography variant="p" component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                                        使いたい食材:
                                    </Typography>
                                    <FoodSelect onDataChange={handleFoodDataChange} ref={FoodSelectRef} />
                                </FormControl>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                                    <Typography variant="p" component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                                        フィルター
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: reviewChecked ? '#000000' : '#c2c2c2' }}>
                                            <Switch
                                                id="review"
                                                checked={reviewChecked}
                                                onChange={handleCheckboxChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <Typography sx={{ fontFamily: 'serif', ml: 1 }}>レビュー:</Typography>
                                            <Rating
                                                name="half-rating"
                                                defaultValue={2.5}
                                                precision={0.2}
                                                size="large"
                                                onChange={handleReviewChange}
                                                disabled={!reviewChecked}
                                                value={val_review}
                                                sx={{ mt: 1 }}
                                            />
                                            <Typography sx={{ fontFamily: 'serif', color: reviewChecked ? '#000000' : '#c2c2c2', mt: 1 }}>
                                                以上
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: cooktimeChecked ? '#000000' : '#c2c2c2', flexWrap: 'wrap', gap: 5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <Switch
                                                    id="cooktime"
                                                    checked={cooktimeChecked}
                                                    onChange={handleCheckboxChange}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                                <Typography sx={{ fontFamily: 'serif', ml: 1 }}>調理時間:</Typography>
                                            </Box>
                                            <Box sx={{ width: 250 }}>
                                                <Slider
                                                    marks={marks_time}
                                                    step={10}
                                                    value={val_time}
                                                    valueLabelDisplay="auto"
                                                    min={MIN_min}
                                                    max={MAX_min}
                                                    onChange={handleTimeChange}
                                                    disabled={!cooktimeChecked}
                                                    id="cooktime_area_select"
                                                    name="cooktime_area_select"
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setValTime(MIN_min)}
                                                        sx={{ cursor: 'pointer', fontFamily: 'serif' }}
                                                    >
                                                        {MIN_min} min
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setValTime(MAX_min)}
                                                        sx={{ cursor: 'pointer', fontFamily: 'serif' }}
                                                    >
                                                        {MAX_min} max
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <ToggleButtonGroup
                                                value={upDownToggle}
                                                exclusive
                                                onChange={handleUpDownChange}
                                                aria-label="Platform"
                                                disabled={!cooktimeChecked}
                                                style={{ color: cooktimeChecked ? '#000000' : '#c2c2c2' }}
                                                {...(cooktimeChecked && { color: "primary" })}
                                            >
                                                <ToggleButton value="1" sx={{ fontFamily: 'serif' }}>以上</ToggleButton>
                                                <ToggleButton value="0" sx={{ fontFamily: 'serif' }} checked>以下</ToggleButton>
                                            </ToggleButtonGroup>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: costChecked ? '#000000' : '#c2c2c2', flexWrap: 'wrap', gap: 5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <Switch
                                                    id="cost"
                                                    checked={costChecked}
                                                    onChange={handleCheckboxChange}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                                <Typography sx={{ fontFamily: 'serif', ml: 1 }}>費用目安:</Typography>
                                            </Box>
                                            <Box sx={{ width: '100%', maxWidth: 250 }}>
                                                <Slider
                                                    marks={marks_cost}
                                                    step={10}
                                                    value={val_cost}
                                                    valueLabelDisplay="auto"
                                                    min={MIN_cost}
                                                    max={MAX_cost}
                                                    onChange={handleCostChange}
                                                    disabled={!costChecked}
                                                    id="cost_area_select"
                                                    name="cost_area_select"
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setValCost(MIN_cost)}
                                                        sx={{ cursor: 'pointer', fontFamily: 'serif' }}
                                                    >
                                                        {MIN_cost} min
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => setValCost(MAX_cost)}
                                                        sx={{ cursor: 'pointer', fontFamily: 'serif' }}
                                                    >
                                                        {MAX_cost} max
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ fontFamily: 'serif', mt: 1 }}>
                                                以下
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: keywordChecked ? '#000000' : '#c2c2c2' }}>
                                            <Switch
                                                id="keyword"
                                                checked={keywordChecked}
                                                onChange={handleCheckboxChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <Typography sx={{ fontFamily: 'serif', ml: 1 }}>キーワード検索:</Typography>
                                            <Box
                                                component="form"
                                                sx={{
                                                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                                                }}
                                                noValidate
                                                autoComplete="off"
                                            ><div>
                                                    <TextField id="keyword_area_select" label="Search field" disabled={!keywordChecked} onChange={handleSearchedFilterChange} value={serchedFilter} InputProps={{style: { fontFamily: 'serif' }}} InputLabelProps={{style: { fontFamily: 'serif' }}} />
                                                </div>
                                            </Box>
                                        </Box>
                                    </Box>
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
        </div>
    );
}

export default Ingredients;
