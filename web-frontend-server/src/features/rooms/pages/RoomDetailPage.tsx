import { useCallback, useState } from 'react'
import {
  App,
  Breadcrumb,
  Button,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Result,
  Tag,
} from 'antd'
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  HeartFilled,
  HeartOutlined,
  SafetyCertificateOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { roomsService } from '../services/rooms.service'
import { currency, priceLabel } from '../lib/room.utils'
import { useFavorites } from '../hooks/favorites.context'
import { useAuth } from '../../auth/hooks/auth.context'
import { useResource } from '../../../shared/hooks/useResource'
import { ResourceState } from '../../../shared/components/ResourceState'
import { config } from '../../../shared/lib/config'

export default function RoomDetailPage() {
  const { id } = useParams()
  const loader = useCallback((signal: AbortSignal) => roomsService.get(Number(id), signal), [id])
  const resource = useResource(loader)
  const room = resource.data
  const { ids, toggle } = useFavorites()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const saved = room ? ids.includes(room.id) : false
  const requestVisit = () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent(`/rooms/${id}`)}`)
    setSubmitted(false)
    setOpen(true)
  }
  if (!room)
    return (
      <div className="page-container min-h-100 py-10">
        <Link to="/rooms" className="text-link">
          <ArrowLeftOutlined /> Danh sách phòng
        </Link>
        <div className="mt-8">
          <ResourceState {...resource} />
        </div>
      </div>
    )
  const images = room.images?.length ? room.images : [room.imageUrl]
  return (
    <div className="page-container py-8 md:py-10">
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/rooms">Tìm phòng</Link> },
          { title: room.title },
        ]}
      />
      <div className="mb-6 mt-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">{room.title}</h1>
          <p className="mt-3 text-sm text-muted">
            <EnvironmentOutlined className="mr-1" />
            {room.address}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            icon={saved ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => toggle(room.id)}
            type={saved ? 'primary' : 'default'}
          >
            {saved ? 'Đã lưu' : 'Lưu phòng'}
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href)
                message.success('Đã sao chép liên kết phòng.')
              } catch {
                message.info('Bạn có thể sao chép liên kết trên thanh địa chỉ.')
              }
            }}
          >
            Chia sẻ
          </Button>
        </div>
      </div>
      <Image.PreviewGroup>
        <div className={`detail-gallery ${images.length > 1 ? 'has-grid' : ''}`}>
          {images.map((src, index) => (
            <Image
              key={`${src}-${index}`}
              src={src}
              alt={`${room.title} — ảnh ${index + 1}`}
              className="!h-full !w-full !object-cover"
              fallback="/images/room-placeholder.svg"
            />
          ))}
        </div>
      </Image.PreviewGroup>
      <div className="grid items-start gap-10 py-9 lg:grid-cols-[1fr_350px]">
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            {room.type && <Tag>{room.type}</Tag>}
            <Tag icon={<ExpandOutlined />}>{room.area} m²</Tag>
            {room.available !== undefined && (
              <Tag color={room.available ? 'green' : 'default'}>
                {room.available ? 'Còn phòng' : 'Đã cho thuê'}
              </Tag>
            )}
          </div>
          <h2 className="mb-4 text-xl font-semibold">Một chút về căn phòng</h2>
          <p className="whitespace-pre-line text-[15px] leading-8 text-muted">
            {room.description ||
              'Không gian phù hợp cho sinh viên muốn tìm một chốn ở thuận tiện và thoải mái. Thông tin chi tiết về căn phòng sẽ được cập nhật. Giá thuê chưa bao gồm các chi phí dịch vụ; vui lòng xác nhận với chủ nhà trước khi quyết định.'}
          </p>
          {!!room.amenities?.length && (
            <section className="mt-8 border-t border-line pt-7">
              <h2 className="mb-5 text-xl font-semibold">Tiện nghi dành cho bạn</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {room.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-muted">
                    <CheckCircleOutlined className="text-lg text-brand" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="mt-8 border-t border-line pt-7">
            <h2 className="mb-4 text-xl font-semibold">Thông tin thuê phòng</h2>
            <Descriptions
              column={1}
              items={[
                { key: 'price', label: 'Giá thuê', children: `${currency(room.price)} / tháng` },
                { key: 'area', label: 'Diện tích', children: `${room.area} m²` },
                { key: 'fees', label: 'Điện, nước, dịch vụ', children: 'Cần xác nhận với chủ nhà' },
                { key: 'deposit', label: 'Tiền cọc', children: 'Theo thỏa thuận khi thuê' },
              ]}
            />
          </section>
        </div>
        <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_#172b3a08] lg:sticky lg:top-26">
          <p className="mb-1 text-sm text-muted">Giá thuê mỗi tháng</p>
          <p className="mb-5">
            <strong className="text-3xl text-brand">{priceLabel(room.price)} triệu</strong>
            <span className="ml-2 text-sm text-muted">/ tháng</span>
          </p>
          <div className="mb-6 border-y border-line py-4 text-sm text-muted">
            <p className="mb-2">
              <ExpandOutlined className="mr-2" />
              {room.area} m² · {room.type || 'Phòng cho thuê'}
            </p>
            <p>
              <EnvironmentOutlined className="mr-2" />
              {room.address}
            </p>
          </div>
          <Button
            block
            type="primary"
            size="large"
            icon={<CalendarOutlined />}
            disabled={room.available === false || config.dataSource !== 'mock'}
            onClick={requestVisit}
          >
            {room.available === false
              ? 'Phòng đã cho thuê'
              : config.dataSource !== 'mock'
                ? 'Chưa có dịch vụ đặt lịch'
                : 'Hẹn xem phòng'}
          </Button>
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-sand p-4 text-xs leading-5 text-muted">
            <SafetyCertificateOutlined className="mt-1 text-lg text-brand" />
            <span>Xem phòng trực tiếp và đọc kỹ thỏa thuận trước khi đặt cọc.</span>
          </div>
        </aside>
      </div>
      <Modal
        open={open}
        title={submitted ? 'Thông tin lịch hẹn' : 'Hẹn xem phòng'}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        {submitted ? (
          <Result
            status="info"
            title="Lịch hẹn chưa được gửi"
            subTitle="Thông tin liên hệ không được lưu. Vui lòng liên hệ trực tiếp để xác nhận lịch xem phòng."
            extra={
              <Button type="primary" onClick={() => setOpen(false)}>
                Tiếp tục khám phá
              </Button>
            }
          />
        ) : (
          <>
            <Form
              layout="vertical"
              requiredMark={false}
              onFinish={() => setSubmitted(true)}
              initialValues={{ name: user?.name }}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập họ và tên.' }]}
              >
                <Input placeholder="Nhập họ và tên đầy đủ" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại.' },
                  { pattern: /^0\d{9}$/, message: 'Nhập 10 chữ số, bắt đầu bằng 0.' },
                ]}
              >
                <Input placeholder="Số điện thoại gồm 10 chữ số" />
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày xem phòng"
                rules={[{ required: true, message: 'Vui lòng chọn ngày xem phòng.' }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày xem phòng"
                  disabledDate={(date) =>
                    date.startOf('day').valueOf() < new Date().setHours(0, 0, 0, 0)
                  }
                />
              </Form.Item>
              <Button block htmlType="submit" type="primary">
                Tiếp tục
              </Button>
            </Form>
          </>
        )}
      </Modal>
      <Link to="/rooms" className="text-link">
        <ArrowLeftOutlined /> Khám phá những căn phòng khác
      </Link>
    </div>
  )
}
