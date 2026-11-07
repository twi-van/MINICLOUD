import { useEffect, useState } from 'react'

export function SafeImage({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [stage, setStage] = useState<'primary' | 'local' | 'placeholder'>('primary')

  useEffect(() => {
    setStage('primary')
  }, [src])

  const roomMatch = src ? src.match(/room-\d+\.jpg/) : null
  const localFallback = roomMatch ? `/images/${roomMatch[0]}` : null

  const handleError = () => {
    if (stage === 'primary' && localFallback && localFallback !== src) {
      setStage('local')
    } else {
      setStage('placeholder')
    }
  }

  const currentSrc =
    stage === 'primary'
      ? src
      : stage === 'local' && localFallback
        ? localFallback
        : '/images/room-placeholder.svg'

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      onError={handleError}
    />
  )
}
