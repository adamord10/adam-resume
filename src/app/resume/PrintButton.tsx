'use client'

import styles from './resume.module.css'

export default function PrintButton() {
  return (
    <button className={styles.printButton} onClick={() => window.print()}>
      print / save as pdf
    </button>
  )
}
