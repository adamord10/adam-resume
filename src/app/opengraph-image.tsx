import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const bars = [
  { top: 290, left: 80, width: 360, accent: true },
  { top: 290, left: 480, width: 300, accent: false },
  { top: 430, left: 200, width: 260, accent: false },
  { top: 430, left: 500, width: 420, accent: false },
]

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: 64, color: '#111111', display: 'flex' }}>{profile.name}</div>
        <div style={{ fontSize: 28, color: '#666666', marginTop: 12, display: 'flex' }}>
          {profile.tagline}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 380,
            left: 80,
            right: 80,
            height: 4,
            background: '#111111',
            display: 'flex',
          }}
        />
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              width: b.width,
              height: 52,
              border: '2px solid #111111',
              background: b.accent ? '#15803d' : '#ffffff',
              display: 'flex',
            }}
          />
        ))}
      </div>
    ),
    size
  )
}
