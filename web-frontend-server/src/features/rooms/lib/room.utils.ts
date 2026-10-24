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
