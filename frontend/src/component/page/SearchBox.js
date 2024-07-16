import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/SearchBox.css'; 

export default function SearchBox() {
    const [inputValue, setInputValue] = useState('');
    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        const parts = value.split('#');

        if (parts.length === 2) {
            setPrefix(parts[0]);
            setSuffix(parts[1]);
        } else {
            setPrefix('');
            setSuffix('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.includes('#')) {
            const [prefix, suffix] = inputValue.split('#');
            navigate(`/${prefix}/${suffix}`);
        } else {
            navigate(`/`);
        }
    };
    

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/${encodeURIComponent(prefix)}/${encodeURIComponent(suffix)}`);
    };

    return (
        <form className="search-box" onSubmit={handleSubmit}>
            <input type="text"
                   value={inputValue}
                   onChange={handleInputChange} 
                   placeholder="플레이어 이름 #KR1"/>
            <button type="submit">검색</button>
        </form>
    );
}