'use client'

import { cn } from '@/lib/utils'

type PremiumMapMarkerProps = {
  label: string
  title: string
  color: string
  active?: boolean
  highlighted?: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function PremiumMapMarker({
  label,
  title,
  color,
  active = false,
  highlighted = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PremiumMapMarkerProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn('premium-map-marker', active && 'is-active', highlighted && 'is-highlighted')}
      style={{ ['--marker-color' as string]: color }}
    >
      {highlighted ? <span className="premium-map-marker__badge">★</span> : null}
      <span className="premium-map-marker__label">{label}</span>
      <span className="premium-map-marker__pointer" />
      <span className="premium-map-marker__tooltip">{title}</span>
    </button>
  )
}