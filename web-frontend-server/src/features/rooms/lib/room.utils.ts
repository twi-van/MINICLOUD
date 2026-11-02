import type { Room } from '../types'

export const districts = ['Quận 7', 'Bình Thạnh', 'Thủ Đức', 'Quận 3', 'Quận 5']
export const roomTypes = ['Studio', 'Phòng trọ', 'Có gác']
export const amenities = [
  'Nội thất',
  'Máy lạnh',
  'Wifi',
  'Bếp riêng',
  'Ban công',
  'Chỗ để xe',
  'Có gác',
]
export const priceLabel = (price: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(price / 1000000)
export const currency = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
export const roomDistrict = (room: Room) =>
  room.district || districts.find((district) => room.address.includes(district)) || 'TP.HCM'

/**
 * Keep MinIO objects on the same origin as the UI. The database seed uses the
 * host-facing MinIO URL, while the gateway exposes the same objects at
 * `/minio/` so browsers do not need a second origin or CORS configuration.
 */
export function resolveRoomImage(src: string) {
  try {
    const url = new URL(src, window.location.origin)
    if (
      (url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname === 'object-storage-server') &&
      url.port === '9000'
    ) {
      return `/minio${url.pathname}${url.search}`
    }
  } catch {
    // Keep malformed/relative values unchanged; SafeImage will show a fallback.
  }
  return src
}
