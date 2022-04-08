import styles from './Header.module.scss'

export default function Header () {
  return (
    <div className={styles.header}>
      <h1>a/<span className={styles.o}>place</span></h1>
    </div>
  )
}