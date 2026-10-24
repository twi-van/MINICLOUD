import { config } from '../../../shared/lib/config'
import { ApiError, getJson, mockResponse } from '../../../shared/lib/http'
import { mockRooms } from '../data/rooms.mock'
import { isRoom, type Room } from '../types'

export const roomsService = {
  async list(signal?: AbortSignal): Promise<Room[]> {
    if (config.dataSource === 'mock') return mockResponse(mockRooms, signal)
    const data = await getJson('/rooms', signal)
    if (!Array.isArray(data) || !data.every(isRoom))
      throw new Error('Dữ liệu phòng chưa đúng định dạng đã thống nhất.')
    return data
  },
  async get(id: number, signal?: AbortSignal): Promise<Room> {
    if (config.dataSource === 'mock') {
      const room = mockRooms.find((item) => item.id === id)
      if (!room) throw new ApiError('Không tìm thấy phòng này.', 404)
      return mockResponse(room, signal)
    }
    const data = await getJson(`/rooms/${id}`, signal)
    if (!isRoom(data)) throw new Error('Dữ liệu chi tiết phòng chưa đúng định dạng.')
    return data
  },
}
