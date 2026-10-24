/** Agreed FE–BE response. Optional fields enrich the UI without changing S1's contract. */
export interface Room {
  id: number
  title: string
  address: string
  price: number
  area: number
  imageUrl: string
  description?: string
  district?: string
  type?: string
  amenities?: string[]
  images?: string[]
  available?: boolean
}

export function isRoom(value: unknown): value is Room {
  if (!value || typeof value !== 'object') return false
  const room = value as Record<string, unknown>
  return (
    typeof room.id === 'number' &&
    typeof room.title === 'string' &&
    typeof room.address === 'string' &&
    typeof room.price === 'number' &&
    typeof room.area === 'number' &&
    typeof room.imageUrl === 'string'
  )
}
