import React, { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';

function App() {
  const [count, setCount] = useState(0);
  function handleClick(){
    setCount(count => count + 1);
  }
  return (<Button variant="contained" onClick={handleClick}>Test{count > 0 ? ` (${count})` : ''}</Button>);
}

export default App;
