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
import Header from './Header.jsx'
import Footer from './Footer.jsx';

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
            const response = await fetch('http://127.0.0.1:5000/api/ingredients_food_submit', {
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
        <div className="Ingredients">
            <Header />
            <div className="search_element">
                <p>使いたい食材:</p>

                <FoodSelect onDataChange={handleFoodDataChange} ref={FoodSelectRef} />

                <p>フィルター</p>

                <p id="review_area" style={{ color: reviewChecked ? '#000000' : '#c2c2c2' }}>
                    <Switch
                        id="review"
                        checked={reviewChecked}
                        onChange={handleCheckboxChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    レビュー:<br />
                    <Rating name="half-rating" defaultValue={2.5} precision={0.2} size="large" onChange={handleReviewChange} disabled={!reviewChecked} value={val_review} />
                    以上
                </p>

                <p id="cooktime_area" style={{ color: cooktimeChecked ? '#000000' : '#c2c2c2' }}>
                    <Switch
                        id="cooktime"
                        checked={cooktimeChecked}
                        onChange={handleCheckboxChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    調理時間:
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
                                sx={{ cursor: 'pointer' }}
                            >
                                {MIN_min} min
                            </Typography>
                            <Typography
                                variant="body2"
                                onClick={() => setValTime(MAX_min)}
                                sx={{ cursor: 'pointer' }}
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
                        <ToggleButton value="1">以上</ToggleButton>
                        <ToggleButton value="0" checked>以下</ToggleButton>
                    </ToggleButtonGroup>
                </p>

                <p id="cost_area" style={{ color: costChecked ? '#000000' : '#c2c2c2' }}>
                    <Switch
                        id="cost"
                        checked={costChecked}
                        onChange={handleCheckboxChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    費用目安:
                    <Box sx={{ width: 250 }}>
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
                                sx={{ cursor: 'pointer' }}
                            >
                                {MIN_cost} min
                            </Typography>
                            <Typography
                                variant="body2"
                                onClick={() => setValCost(MAX_cost)}
                                sx={{ cursor: 'pointer' }}
                            >
                                {MAX_cost} max
                            </Typography>
                        </Box>
                    </Box>
                    以下
                </p>

                <p id="keyword_area" style={{ color: keywordChecked ? '#000000' : '#c2c2c2' }}>
                    <Switch
                        id="keyword"
                        checked={keywordChecked}
                        onChange={handleCheckboxChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    キーワード検索:
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    ><div>
                            <TextField id="keyword_area_select" label="Search field" disabled={!keywordChecked} onChange={handleSearchedFilterChange} value={serchedFilter} />
                        </div>
                    </Box>
                </p>

                <div>
                    <button type="button" className="btn btn-outline-dark" onClick={handleSubmit}>検索</button>
                    <button type="button" className="btn btn-outline-dark" onClick={StorageReset}>リセット</button>
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default Ingredients;
