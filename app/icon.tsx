import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080808',
          color: '#C67A3C',
          fontFamily: 'sans-serif',
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: '-0.04em',
        }}
      >
        TA
      </div>
    ),
    { ...size }
  )
}
