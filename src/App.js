import { useState } from 'react'
import ColorContext from './context/ColorContext'
import Board from "./components/Board";
import "./styles.css";
import Header from './components/Header';

export default function App() {  
  const [color, setColor] = useState(null)
  
  return (
    <div className="App">
      <Header />

      <ColorContext.Provider value={{ color, setColor }}>
        <Board />
      </ColorContext.Provider>
    </div>
  );
}
