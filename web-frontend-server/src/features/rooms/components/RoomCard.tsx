import {
  ArrowRightOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  ExpandOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { App, Tooltip } from 'antd'
import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { Room } from '../types'
import { priceLabel, roomDistrict } from '../lib/room.utils'
import { useFavorites } from '../hooks/favorites.context'
import { SafeImage } from '../../../shared/components/SafeImage'

export function RoomCard({ room }: { room: Room }) {
  const { ids, toggle } = useFavorites()
  const saved = ids.includes(room.id)
  const { message } = App.useApp()
  const reduced = useReducedMotion()
  return (
    <motion.article
      className="room-card group"
      initial={false}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
    >
      <div className="room-card-media relative overflow-hidden rounded-xl">
        <Link to={`/rooms/${room.id}`} tabIndex={-1} aria-hidden="true">
          <SafeImage
            src={room.imageUrl}
            alt={room.title}
            className="aspect-[1.48] w-full object-cover transition duration-200 group-hover:scale-[1.03]"
          />
        </Link>
        <span className="room-type-sticker">{room.type || 'Phòng cho thuê'}</span>
        <Tooltip title={saved ? 'Bỏ lưu phòng' : 'Lưu phòng'}>
          <motion.button
            className={`save-button ${saved ? 'is-saved' : ''}`}
            aria-label={`${saved ? 'Bỏ lưu' : 'Lưu'} ${room.title}`}
            aria-pressed={saved}
            whileTap={reduced ? undefined : { scale: 0.78 }}
            animate={{ scale: saved && !reduced ? [1, 1.22, 1] : 1 }}
            onClick={() => {
              toggle(room.id)
              message.success({
                key: 'favorite',
                content: saved ? 'Đã bỏ lưu phòng.' : 'Đã lưu phòng vào danh sách yêu thích.',
                duration: 2,
              })
            }}
          >
            {saved ? <HeartFilled /> : <HeartOutlined />}
          </motion.button>
        </Tooltip>
        {saved && (
          <span className="save-burst" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} style={{ '--angle': `${(i * 360) / 7}deg` } as CSSProperties} />
            ))}
          </span>
        )}
        <Link to={`/rooms/${room.id}`} className="room-hover-link" tabIndex={-1} aria-hidden="true">
          Vào xem thử <ArrowRightOutlined />
        </Link>
      </div>
      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted">
            <EnvironmentOutlined /> {roomDistrict(room)}, TP.HCM
          </span>
          {room.available !== undefined && (
            <span className={room.available ? 'text-emerald-700' : 'text-muted'}>
              {room.available ? (
                <>
                  <CheckCircleFilled /> Còn phòng
                </>
              ) : (
                'Đã cho thuê'
              )}
            </span>
          )}
        </div>
        <h3 className="mb-3 truncate text-[17px] font-semibold">
          <Link to={`/rooms/${room.id}`} className="hover:text-brand">
            {room.title}
          </Link>
        </h3>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>
            <ExpandOutlined /> {room.area} m²
          </span>
          <span className="mx-1 text-slate-300">|</span>
          {(room.amenities || []).slice(0, 2).map((item) => (
            <span className="rounded bg-sand px-2 py-1" key={item}>
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <p>
            <strong className="text-xl text-brand">{priceLabel(room.price)} triệu</strong>
            <span className="ml-1 text-xs text-muted">/ tháng</span>
          </p>
          <Link
            to={`/rooms/${room.id}`}
            aria-label={`Chi tiết ${room.title}`}
            className="room-arrow flex size-8 items-center justify-center rounded-full bg-sand text-navy"
          >
            <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
