import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  bgColor?: string
  fgColor?: string
  includeMargin?: boolean
  className?: string
}

export default function QRCodeToCanvas({
  value,
  size = 256,
  level = 'M',
  bgColor = '#ffffff',
  fgColor = '#000000',
  includeMargin = true,
  className = '',
}: QRProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!value) return

    const canvas = canvasRef.current
    if (!canvas) return

    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: level,
      margin: includeMargin ? 4 : 0,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      width: size,
    }

    QRCode.toCanvas(canvas, value, options, (err) => {
      if (err) console.error(err)
    })
  }, [value, size, level, fgColor, bgColor, includeMargin])

  return <canvas ref={canvasRef} width={size} height={size} className={className} />
}
