import ColorPicker from '../ColorPicker'
import Canvas from '../Grid'
import styles from './Board.module.scss'

export default function Board () {
  return (
    <div className={styles.container}>
      <ColorPicker />
      <Canvas />
    </div>
  )
}