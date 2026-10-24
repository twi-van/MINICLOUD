import { config } from '../../../shared/lib/config'
import { getJson, mockResponse } from '../../../shared/lib/http'
import { mockStudents } from '../data/students.mock'
import { isStudent, type Student } from '../types'

export const studentsService = {
  async list(signal?: AbortSignal): Promise<Student[]> {
    if (config.dataSource === 'mock') return mockResponse(mockStudents, signal)
    const data = await getJson('/student', signal)
    if (!Array.isArray(data) || !data.every(isStudent))
      throw new Error('Dữ liệu sinh viên chưa đúng định dạng đã thống nhất.')
    return data
  },
}
