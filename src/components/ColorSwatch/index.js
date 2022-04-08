import { useContext } from 'react'
import ColorContext from '../../context/ColorContext'
import styles from './ColorSwatch.module.scss'

export default function ColorSwatch (props) {
  var { color, setColor } = useContext(ColorContext);

  const handleClick = () => {
    setColor(props.color)
  }
  
  return (
    <div className={`${styles.color} ${styles[props.color]} ${color === props.color ? styles.active : ''}`}
      onClick={handleClick}></div>
  )
}