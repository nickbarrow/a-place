import { useContext } from 'react';
import ColorContext from '../../context/ColorContext';
import ColorSwatch from '../ColorSwatch';
import styles from './ColorPicker.module.scss'

export default function ColorPicker () {
  let { setColor } = useContext(ColorContext)

  const COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'brown',
    'black',
    'white'
  ];

  return (
    <div className={styles.container}>
      <div style={{
        width: '30px',
        height: '30px',
        cursor: 'pointer'
      }} onClick={() => { setColor(null) }}>🤚</div>
      {COLORS.map(color => {
        return <ColorSwatch color={color} key={`color_${color}`} />
      })}
    </div>
  )
}