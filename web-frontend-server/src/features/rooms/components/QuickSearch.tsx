import { useCallback, useEffect, useRef, useState } from 'react'
import { Empty, Input, Modal } from 'antd'
import { ArrowRightOutlined, EnterOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { roomsService } from '../services/rooms.service'
import { useResource } from '../../../shared/hooks/useResource'
import { ResourceState } from '../../../shared/components/ResourceState'
import { normalize } from '../../../shared/lib/text'
import { SafeImage } from '../../../shared/components/SafeImage'
import { priceLabel } from '../lib/room.utils'

export function QuickSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement>(null)
  const loader = useCallback(
    (signal: AbortSignal) => (open ? roomsService.list(signal) : Promise.resolve([])),
    [open],
  )
  const resource = useResource(loader)
  const results = (resource.data || [])
    .filter((room) => normalize(`${room.title} ${room.address}`).includes(normalize(query)))
    .slice(0, 5)
  const activeIndex = Math.min(active, Math.max(0, results.length - 1))
  const go = (id: number) => {
    onClose()
    navigate(`/rooms/${id}`)
  }
  useEffect(() => {
    root.current
      ?.querySelector(`[data-result-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Tìm nhanh một chốn về"
      width={640}
      className="quick-search-modal"
      afterOpenChange={(visible) => {
        if (visible) root.current?.querySelector('input')?.focus()
      }}
    >
      <div ref={root}>
        <Input
          size="large"
          prefix={<SearchOutlined />}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          placeholder="Tên phòng, khu vực, một góc bình yên…"
          aria-label="Tìm phòng nhanh"
          aria-controls="quick-search-results"
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive((activeIndex + 1) % Math.max(1, results.length))
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive((activeIndex - 1 + results.length) % Math.max(1, results.length))
            }
            if (event.key === 'Enter' && results[activeIndex]) {
              event.preventDefault()
              go(results[activeIndex].id)
            }
          }}
        />
        <p className="mb-3 mt-5 text-[11px] font-semibold uppercase tracking-widest text-muted">
          {query ? 'Tìm thấy đúng vibe?' : 'Một vài căn phòng dành cho bạn'}
        </p>
        <ResourceState {...resource} />
        <div id="quick-search-results" className="quick-results">
          {results.map((room, index) => (
            <button
              data-result-index={index}
              key={room.id}
              className={`quick-result ${index === activeIndex ? 'active' : ''}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => go(room.id)}
            >
              <SafeImage
                src={room.imageUrl}
                alt=""
                className="size-16 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1 text-left">
                <strong className="block truncate text-sm font-semibold">{room.title}</strong>
                <small className="mt-1 block truncate text-xs text-muted">{room.address}</small>
                <span className="mt-1 block text-xs font-semibold text-brand">
                  {priceLabel(room.price)} triệu / tháng
                </span>
              </span>
              <ArrowRightOutlined className="shrink-0" />
            </button>
          ))}
        </div>
        {!resource.loading && !resource.error && !results.length && (
          <Empty className="!py-5" description="Chưa tìm thấy. Thử một từ khóa khác nhé!" />
        )}
        <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-[11px] text-muted">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> Chọn phòng <kbd className="ml-2">↵</kbd> Mở phòng
          </span>
          <span>
            <EnterOutlined /> <kbd>esc</kbd> Đóng
          </span>
        </div>
      </div>
    </Modal>
  )
}
