import type { Room } from '../../rooms/types'
import { RoomCard } from '../../rooms/components/RoomCard'
import { HorizontalRail } from '../../../shared/components/HorizontalRail'

export function FeaturedRoomRail({ rooms }: { rooms: Room[] }) {
  return (
    <HorizontalRail label="Phòng nổi bật, kéo ngang để xem thêm">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </HorizontalRail>
  )
}
