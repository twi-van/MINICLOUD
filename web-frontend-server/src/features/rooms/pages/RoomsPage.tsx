import { useRef, useState } from 'react'
import { Button, Checkbox, Empty, Input, Pagination, Select, Slider, Tag } from 'antd'
import {
  AppstoreOutlined,
  HeartOutlined,
  DollarOutlined,
  HomeOutlined,
  SunOutlined,
  ToolOutlined,
  ReloadOutlined,
  SearchOutlined,
  SlidersOutlined,
  LeftOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
import { RoomCard } from '../components/RoomCard'
import { amenities, districts, roomDistrict, roomTypes } from '../lib/room.utils'
import { normalize } from '../../../shared/lib/text'
import { roomsService } from '../services/rooms.service'
import { useResource } from '../../../shared/hooks/useResource'
import { SafeImage } from '../../../shared/components/SafeImage'
import { ResourceState } from '../../../shared/components/ResourceState'
import { useFavorites } from '../hooks/favorites.context'
import { motion, useReducedMotion } from 'motion/react'

const loadRooms = (signal: AbortSignal) => roomsService.list(signal)

export default function RoomsPage() {
  const resource = useResource(loadRooms)
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)
  const desktopFilterButton = useRef<HTMLButtonElement>(null)
  const mobileFilterButton = useRef<HTMLButtonElement>(null)
  const { ids } = useFavorites()
  const reduced = useReducedMotion()
  const update = (key: string, value?: string) => {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }
  const savedOnly = params.get('saved') === 'true'
  const selectedAmenities = params.get('amenities')?.split(',').filter(Boolean) || []
  const priceCeiling = Math.max(
    8,
    ...(resource.data || []).map((room) => Math.ceil(room.price / 1000000)),
  )
  const requestedMaxPrice = Number(params.get('maxPrice'))
  const maxPrice =
    Number.isFinite(requestedMaxPrice) && requestedMaxPrice >= 1 ? requestedMaxPrice : priceCeiling
  const sliderMax = Math.max(priceCeiling, maxPrice)
  const query = normalize(params.get('q') || '')
  const rooms = (resource.data || [])
    .filter((room) => {
      const budget = params.get('budget')
      return (
        (!query || normalize(`${room.title} ${room.address}`).includes(query)) &&
        (!params.get('district') || roomDistrict(room) === params.get('district')) &&
        (!params.get('type') || room.type === params.get('type')) &&
        (!savedOnly || ids.includes(room.id)) &&
        room.price <= maxPrice * 1000000 &&
        (!budget ||
          (budget === 'under3' && room.price < 3000000) ||
          (budget === '3to4' && room.price >= 3000000 && room.price <= 4000000) ||
          (budget === 'over4' && room.price > 4000000)) &&
        selectedAmenities.every((value) => room.amenities?.includes(value)) &&
        (params.get('available') !== 'true' || room.available === true)
      )
    })
    .sort((a, b) =>
      params.get('sort') === 'price-asc'
        ? a.price - b.price
        : params.get('sort') === 'price-desc'
          ? b.price - a.price
          : params.get('sort') === 'area'
            ? b.area - a.area
            : a.id - b.id,
    )
  const requestedPage = Number(params.get('page'))
  const page = Math.min(
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    Math.max(1, Math.ceil(rooms.length / 6)),
  )
  return (
    <div className="page-container rooms-page pb-16">
      <section className="rooms-discovery-header">
        <div className="page-intro">
          <span className="eyebrow">KHÁM PHÁ KHÔNG GIAN SỐNG</span>
          <h1>
            {savedOnly ? (
              'Những căn phòng bạn thương'
            ) : (
              <>
                Tìm chốn ở <span>dành riêng cho bạn.</span>
              </>
            )}
          </h1>
          <p>Tìm không gian phù hợp với ngân sách và nhịp sống của riêng bạn.</p>
        </div>
        <div className="room-quick-filters" role="group" aria-label="Bộ lọc gợi ý">
          {[
            { label: 'Dưới 3 triệu', icon: <DollarOutlined />, key: 'budget', value: 'under3' },
            { label: 'Studio riêng tư', icon: <HomeOutlined />, key: 'type', value: 'Studio' },
            { label: 'Có ban công', icon: <SunOutlined />, key: 'amenities', value: 'Ban công' },
            { label: 'Nội thất sẵn', icon: <ToolOutlined />, key: 'amenities', value: 'Nội thất' },
          ].map((preset) => (
            <button
              key={preset.label}
              aria-pressed={
                preset.key === 'amenities'
                  ? selectedAmenities.includes(preset.value)
                  : params.get(preset.key) === preset.value
              }
              className={
                (
                  preset.key === 'amenities'
                    ? selectedAmenities.includes(preset.value)
                    : params.get(preset.key) === preset.value
                )
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                update(
                  preset.key,
                  preset.key === 'amenities'
                    ? (selectedAmenities.includes(preset.value)
                        ? selectedAmenities.filter((value) => value !== preset.value)
                        : [...selectedAmenities, preset.value]
                      ).join(',')
                    : params.get(preset.key) === preset.value
                      ? undefined
                      : preset.value,
                )
              }
            >
              <span aria-hidden="true">{preset.icon}</span> {preset.label}
            </button>
          ))}
        </div>
        <div className="rooms-header-art" aria-hidden="true">
          <SafeImage src="/images/room-1.jpg" alt="" eager />
          <SafeImage src="/images/room-4.jpg" alt="" eager />
        </div>
      </section>
      <div className="rooms-search-surface mb-7 flex flex-wrap gap-3">
        <Input
          className="rooms-query !min-w-60 !flex-1"
          variant="borderless"
          size="large"
          prefix={<SearchOutlined className="text-muted" />}
          allowClear
          placeholder="Tìm theo tên phòng, địa chỉ…"
          aria-label="Tìm theo tên phòng, địa chỉ"
          value={params.get('q') || ''}
          onChange={(event) => update('q', event.target.value)}
        />
        <Button
          size="large"
          icon={<HeartOutlined />}
          className="rooms-saved-button"
          type={savedOnly ? 'primary' : 'default'}
          onClick={() => update('saved', savedOnly ? undefined : 'true')}
        >
          Đã lưu ({ids.length})
        </Button>
        <Button
          ref={mobileFilterButton}
          className="lg:!hidden"
          size="large"
          icon={<SlidersOutlined />}
          onClick={() => {
            setFiltersOpen(!filtersOpen)
            setFiltersCollapsed(false)
          }}
          aria-expanded={filtersOpen}
        >
          Bộ lọc
        </Button>
      </div>
      <div
        className={`rooms-layout ${filtersCollapsed ? 'filters-hidden' : ''} grid items-start gap-8 lg:grid-cols-[245px_1fr]`}
      >
        <aside
          id="rooms-filter-panel"
          aria-label="Bộ lọc phòng"
          className={`filter-panel ${filtersCollapsed ? 'is-collapsed' : ''} ${filtersOpen ? 'block' : 'hidden'} lg:block`}
        >
          <div
            className={`${filtersCollapsed ? '' : 'mb-6'} flex items-center justify-between gap-2`}
          >
            <h2 className="min-w-0 flex-1 font-semibold">
              <button
                type="button"
                className="filter-collapse-toggle"
                aria-expanded={!filtersCollapsed}
                aria-controls="room-filter-fields"
                aria-label="Ẩn bộ lọc"
                onClick={() => {
                  setFiltersCollapsed(true)
                  setFiltersOpen(false)
                  if (window.matchMedia('(min-width: 1024px)').matches)
                    requestAnimationFrame(() => desktopFilterButton.current?.focus())
                  else mobileFilterButton.current?.focus()
                }}
              >
                <SlidersOutlined /> Bộ lọc
                <LeftOutlined className="filter-collapse-chevron" />
              </button>
            </h2>
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => setParams({})}
            >
              Đặt lại
            </Button>
          </div>
          <div id="room-filter-fields" hidden={filtersCollapsed}>
            <label className="filter-label" htmlFor="filter-district">
              Khu vực
            </label>
            <Select
              id="filter-district"
              className="w-full"
              value={params.get('district') || undefined}
              placeholder="Tất cả khu vực"
              allowClear
              onChange={(value) => update('district', value)}
              options={districts.map((value) => ({ value, label: value }))}
            />
            <label className="filter-label mt-6" htmlFor="filter-budget">
              Khoảng giá
            </label>
            <Select
              id="filter-budget"
              className="w-full"
              allowClear
              value={params.get('budget') || undefined}
              placeholder="Tất cả khoảng giá"
              onChange={(value) => update('budget', value)}
              options={[
                { value: 'under3', label: 'Dưới 3 triệu' },
                { value: '3to4', label: '3 – 4 triệu' },
                { value: 'over4', label: 'Trên 4 triệu' },
              ]}
            />
            <div className="mb-2 mt-5 flex justify-between text-xs text-muted">
              <span>Tối đa</span>
              <strong className="text-navy">{maxPrice} triệu / tháng</strong>
            </div>
            <Slider
              min={1}
              max={sliderMax}
              step={0.5}
              value={maxPrice}
              tooltip={{ formatter: (value) => `${value} triệu` }}
              onChange={(value) => update('maxPrice', String(value))}
              aria-label="Giá thuê tối đa"
            />
            <label className="filter-label mt-6" htmlFor="filter-type">
              Loại phòng
            </label>
            <Select
              id="filter-type"
              className="w-full"
              allowClear
              value={params.get('type') || undefined}
              placeholder="Tất cả loại phòng"
              onChange={(value) => update('type', value)}
              options={roomTypes.map((value) => ({ value, label: value }))}
            />
            <h3 className="filter-label mt-6">Tiện nghi</h3>
            <Checkbox.Group
              value={selectedAmenities}
              onChange={(values) => update('amenities', values.join(','))}
              className="!flex !flex-col !gap-3"
            >
              {amenities.map((value) => (
                <Checkbox value={value} key={value}>
                  {value}
                </Checkbox>
              ))}
            </Checkbox.Group>
            <div className="mt-6 border-t border-line pt-5">
              <Checkbox
                checked={params.get('available') === 'true'}
                onChange={(event) => update('available', event.target.checked ? 'true' : undefined)}
              >
                Chỉ hiển thị phòng trống
              </Checkbox>
            </div>
          </div>
        </aside>
        <section className="min-w-0" aria-label="Kết quả tìm phòng">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {filtersCollapsed && (
                <button
                  ref={desktopFilterButton}
                  type="button"
                  className="filter-icon-toggle hidden lg:flex"
                  aria-label="Mở bộ lọc"
                  title="Mở bộ lọc"
                  aria-expanded={false}
                  aria-controls="rooms-filter-panel"
                  onClick={() => {
                    setFiltersCollapsed(false)
                    requestAnimationFrame(() =>
                      document.querySelector<HTMLButtonElement>('.filter-collapse-toggle')?.focus(),
                    )
                  }}
                >
                  <MenuOutlined />
                </button>
              )}
              <p className="text-sm text-muted">
                <AppstoreOutlined className="mr-2" />
                {resource.loading ? (
                  'Đang tìm phòng…'
                ) : (
                  <>
                    <motion.strong
                      key={rooms.length}
                      initial={reduced ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block text-navy"
                    >
                      {rooms.length}
                    </motion.strong>{' '}
                    phòng phù hợp với bạn
                  </>
                )}
              </p>
            </div>
            <Select
              aria-label="Sắp xếp phòng"
              value={params.get('sort') || 'recommended'}
              onChange={(value) => update('sort', value)}
              className="!w-48"
              options={[
                { value: 'recommended', label: 'Gợi ý cho bạn' },
                { value: 'price-asc', label: 'Giá từ thấp đến cao' },
                { value: 'price-desc', label: 'Giá từ cao đến thấp' },
                { value: 'area', label: 'Diện tích lớn nhất' },
              ]}
            />
          </div>
          {params.get('district') && (
            <Tag closable onClose={() => update('district')} className="!mb-4">
              {params.get('district')}
            </Tag>
          )}
          <ResourceState {...resource} />
          {!resource.loading &&
            !resource.error &&
            (rooms.length ? (
              <>
                <motion.div
                  key={rooms.map((room) => room.id).join(',') + page}
                  className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {rooms.slice((page - 1) * 6, page * 6).map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </motion.div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-line py-20">
                <Empty
                  description={
                    savedOnly
                      ? 'Chưa có phòng đã lưu phù hợp với bộ lọc.'
                      : 'Chưa có phòng phù hợp. Thử nới rộng bộ lọc nhé.'
                  }
                >
                  <Button onClick={() => setParams({})}>Xem tất cả phòng</Button>
                </Empty>
              </div>
            ))}
        </section>
      </div>
      {!resource.loading && !resource.error && rooms.length > 0 && (
        <div className={`rooms-pagination ${filtersCollapsed ? 'filters-hidden' : ''} mt-10`}>
          <Pagination
            className="!justify-center"
            current={page}
            total={rooms.length}
            pageSize={6}
            showSizeChanger={false}
            hideOnSinglePage
            onChange={(value) => {
              update('page', String(value))
              window.scrollTo({ top: 200, behavior: 'smooth' })
            }}
          />
        </div>
      )}
    </div>
  )
}
