import { postJson } from '../../../shared/lib/http'

export type CreateBookingInput = {
  roomId: number
  guestName: string
  phone: string
  visitDate: string
}

export const bookingsService = {
  create(input: CreateBookingInput, signal?: AbortSignal) {
    return postJson('/bookings', input, signal)
  },
}
