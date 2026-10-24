import { useRef } from 'react'
import type { ReactNode } from 'react'

export function HorizontalRail({
  children,
  label,
  className = '',
}: {
  children: ReactNode
  label: string
  className?: string
}) {
  const gesture = useRef({ down: false, dragged: false, startX: 0, scroll: 0 })
  return (
    <div
      className={`featured-room-rail ${className}`}
      role="region"
      aria-label={label}
      tabIndex={0}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (
          event.pointerType !== 'mouse' ||
          event.button !== 0 ||
          (event.target as Element).closest('button')
        )
          return
        gesture.current = {
          down: true,
          dragged: false,
          startX: event.clientX,
          scroll: event.currentTarget.scrollLeft,
        }
      }}
      onPointerMove={(event) => {
        const state = gesture.current
        if (!state.down) return
        const delta = event.clientX - state.startX
        if (Math.abs(delta) > 6 && !state.dragged) {
          state.dragged = true
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.classList.add('is-dragging')
        }
        if (state.dragged) event.currentTarget.scrollLeft = state.scroll - delta
      }}
      onPointerUp={(event) => {
        gesture.current.down = false
        event.currentTarget.classList.remove('is-dragging')
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      onPointerCancel={(event) => {
        gesture.current.down = false
        event.currentTarget.classList.remove('is-dragging')
      }}
      onPointerLeave={() => {
        gesture.current.down = false
      }}
      onClickCapture={(event) => {
        if (!gesture.current.dragged) return
        event.preventDefault()
        event.stopPropagation()
        gesture.current.dragged = false
      }}
      onKeyDown={(event) => {
        if (
          event.target !== event.currentTarget ||
          !['ArrowLeft', 'ArrowRight'].includes(event.key)
        )
          return
        event.preventDefault()
        event.currentTarget.scrollBy({
          left: (event.key === 'ArrowRight' ? 1 : -1) * event.currentTarget.clientWidth * 0.85,
        })
      }}
    >
      {children}
    </div>
  )
}
