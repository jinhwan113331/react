import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBox from './SearchBox';

export default function SearchUser(props) {
  const { query } = useParams();
  const [data, setData] = useState([]);
  const { prefix, suffix } = useParams();

  const tagid = prefix;
  const input = suffix;
  
  console.log(tagid);
  console.log(input);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://api.example.com/search?query=${query}?api_key=RGAPI-509e5b2f-c3c9-441b-a7e8-40cafb93db95`);
      const result = await res.json();
      setData(result);
      
    };

    fetchData();
  }, [query]);
  
  return (
    <div>
      {data.map(d => (
        <div key={d.id}>{d.title}</div>
      ))}
    </div>
  );
}
