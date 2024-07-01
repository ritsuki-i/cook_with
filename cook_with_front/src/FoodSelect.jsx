import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const FoodSelect = forwardRef(({ onDataChange }, ref) => {
  const [foods, setFoods] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const url = 'http://127.0.0.1:5000';

  useEffect(() => {
    // ローカルストレージから初期値を取得
    const savedValue = JSON.parse(sessionStorage.getItem('selectedFood')) || [];
    setSelectedValue(savedValue);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + '/api/search_home/food_data');
        const data = await response.json();
        setFoods(data.foods.map(food => ({ value: food, label: food })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    // selectedValueが更新された後に実行される
    onDataChange(selectedValue);
    sessionStorage.setItem('selectedFood', JSON.stringify(selectedValue));
  }, [selectedValue, onDataChange]);

  const handleFoodDataChange = (selectedOptions) => {
    if (selectedOptions) {
      // 選択されたオプション全体を保存
      setSelectedValue(selectedOptions);
    } else {
      setSelectedValue([]);
    }
  };

  //親要素のリセットボタンクリック
  useImperativeHandle(ref, () => ({
    clearSelection: () => {
      setSelectedValue([]);
      sessionStorage.setItem('selectedFood', JSON.stringify([]));
    }
  }));

  return (
    <div className='FoodSelect'>
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={foods}
        value={selectedValue}
        onChange={handleFoodDataChange}
        isMulti
      />
    </div>
  );
});

export default FoodSelect;
