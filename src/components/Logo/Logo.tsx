'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Logo.module.css'

type Props = {
  src?: string
  name: string
  size?: number
}

// Renders the org logo; falls back to a monogram square until the
// real image file exists under /public.
export default function Logo({ src, name, size = 18 }: Props) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // The error event can fire before hydration attaches onError, so also
  // check the loaded state on mount.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [src])

  if (src && !failed) {
    return (
      <img
        ref={imgRef}
        src={src}
        alt=""
        width={size}
        height={size}
        className={styles.logo}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span
      className={styles.monogram}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  )
}
