import { createContext } from 'react';

const ColorContext = createContext({
  color: null,
  setColor: () => {},
});

export default ColorContext;