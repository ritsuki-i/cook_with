import React, { useState } from 'react';
import Select from 'react-select';

function App() {
    const [selectedValue, setSelectedValue] = useState([]);

    const foods = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'carrot', label: 'Carrot' },
    ];

    return (
        <div className="App">
            <h1>Food Select</h1>
            <Select
                options={foods}
                defaultValue={selectedValue}
                onChange={(value) => setSelectedValue(value)}
                isMulti 
            />
            <p>Selected Values: {JSON.stringify(selectedValue)}</p>
        </div>
    );
}

export default App;
