import { useState } from 'react'
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Button, Empty } from 'antd'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { RoomSearch } from '../../rooms/components/RoomSearch'
import { CategoryIcon } from '../components/CategoryIcon'
import { FeaturedRoomRail } from '../components/FeaturedRoomRail'
import { roomsService } from '../../rooms/services/rooms.service'
import { useResource } from '../../../shared/hooks/useResource'
import { ResourceState } from '../../../shared/components/ResourceState'
import { SafeImage } from '../../../shared/components/SafeImage'
import { Reveal } from '../../../shared/components/Reveal'
import { posts } from '../../blog/data/posts'
import { HorizontalRail } from '../../../shared/components/HorizontalRail'
import { BlogCard } from '../../blog/components/BlogCard'
import { RoomMatchQuiz } from '../components/RoomMatchQuiz'

const loadFeatured = (signal: AbortSignal) => roomsService.list(signal)
const roomCategories = [
  { label: 'Tất cả phòng', value: '' },
  { label: 'Studio', value: 'Studio' },
  { label: 'Phòng trọ', value: 'Phòng trọ' },
  { label: 'Có gác', value: 'Có gác' },
]
const neighborhoods = [
  { name: 'Thủ Đức', note: 'Năng động, gần làng đại học', image: '/images/room-3.jpg' },
  {
    name: 'Bình Thạnh',
    note: 'Kết nối thuận tiện, sống trọn từng ngày',
    image: '/images/room-2.jpg',
  },
  { name: 'Quận 7', note: 'Không gian xanh, nhịp sống nhẹ nhàng', image: '/images/room-6.jpg' },
]

export default function HomePage() {
  const rooms = useResource(loadFeatured)
  const [category, setCategory] = useState('')
  const [quizOpen, setQuizOpen] = useState(false)
  const reduced = useReducedMotion()
  const featured = (rooms.data || []).filter((room) => !category || room.type === category)
  return (
    <>
      <section className="hero-section">
        <div className="page-container relative">
          <div className="hero-grid">
            <motion.div
              className="hero-copy"
              initial={reduced ? false : { opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand" /> KHỞI ĐẦU MỚI, CHỐN VỀ MỚI
              </span>
              <h1>
                Tìm một căn phòng.
                <br />
                Bắt đầu <span className="hero-accent">một hành trình.</span>
              </h1>
              <div className="hero-description-row">
                <p className="max-w-md text-[16px] leading-7 text-muted">
                  Một nơi ở vừa túi tiền, gần trường và đúng với bạn.
                  <br className="hidden lg:block" /> Cùng MiniHome tìm chốn về cho những năm tháng
                  sinh viên.
                </p>
                <button
                  type="button"
                  className="hero-photo-note hero-quiz-note"
                  onClick={() => setQuizOpen(true)}
                >
                  <ThunderboltOutlined />
                  <strong>Gợi ý phòng phù hợp</strong>
                </button>
              </div>
            </motion.div>
            <div className="hero-visual">
              <SafeImage
                src="/images/room-1.jpg"
                alt="Căn phòng sáng với nội thất gỗ và không gian sống thoáng đãng"
                eager
                className="hero-main-image"
              />
            </div>
          </div>
          <RoomSearch />
        </div>
      </section>
      <div className="page-container">
        <section className="popular-section" aria-labelledby="popular-title">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">KHÁM PHÁ NHANH</span>
              <h2 id="popular-title">Danh mục phổ biến</h2>
            </div>
            <Link to="/rooms" className="text-link">
              Xem tất cả <ArrowRightOutlined />
            </Link>
          </Reveal>
          <div className="popular-grid">
            {roomCategories.map((item, index) => (
              <Link
                key={item.value}
                to={item.value ? `/rooms?type=${encodeURIComponent(item.value)}` : '/rooms'}
                className="popular-card"
              >
                <SafeImage src={`/images/room-${[3, 1, 4, 6][index]}.jpg`} alt="" />
                <span className="popular-label">
                  <span className="popular-title">
                    <span className="popular-icon" aria-hidden="true">
                      <CategoryIcon index={index} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <ArrowRightOutlined />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="section-space featured-section">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">MỘT CHÚT GỢI Ý CHO BẠN</span>
              <h2>Phòng xinh, giá vừa túi</h2>
              <p>Những không gian nhỏ sẵn sàng cho một chương mới.</p>
            </div>
            <div className="featured-heading-actions">
              <div
                className="home-room-filters flex flex-wrap gap-2"
                role="group"
                aria-label="Chọn phong cách phòng"
              >
                {roomCategories.map((item) => (
                  <Button
                    key={item.value}
                    type={category === item.value ? 'primary' : 'default'}
                    aria-pressed={category === item.value}
                    onClick={() => setCategory(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>{' '}
              <Link to="/rooms" className="text-link">
                Khám phá tất cả <ArrowRightOutlined />
              </Link>
            </div>
          </Reveal>
          <ResourceState {...rooms} />
          {rooms.data && (
            <>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={category}
                  className="featured-rail-stage"
                  initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FeaturedRoomRail rooms={featured} />
                </motion.div>
              </AnimatePresence>
              {!featured.length && (
                <Empty description="Chưa có phòng thuộc loại này. Bạn thử lựa chọn khác nhé." />
              )}
            </>
          )}
        </section>
        <section className="benefit-strip" aria-label="Tiện ích tìm phòng">
          {[
            {
              icon: <SafetyCertificateOutlined />,
              title: 'Tìm phòng an tâm',
              detail: 'Giá và thông tin ngay trên từng tin',
            },
            {
              icon: <EnvironmentOutlined />,
              title: 'Gần hơn với trường',
              detail: 'Chọn khu vực hợp với lịch học',
            },
            {
              icon: <TeamOutlined />,
              title: 'Dành cho sinh viên',
              detail: 'Nhiều lựa chọn vừa ngân sách',
            },
          ].map((item, index) => (
            <Reveal delay={index * 0.06} key={item.title} className="flex items-center gap-4">
              <span className="benefit-icon">{item.icon}</span>
              <div>
                <h2 className="text-sm font-semibold">{item.title}</h2>
                <p className="mt-1 text-xs text-muted">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </section>
        <section className="neighborhood-section">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">TÌM MỘT NƠI THUỘC VỀ</span>
              <h2>Bạn muốn sống ở đâu?</h2>
              <p>Mỗi khu vực, một nhịp sống. Chọn nhịp sống của bạn.</p>
            </div>
          </Reveal>
          <div className="neighborhood-grid">
            {neighborhoods.map((area, index) => (
              <Reveal key={area.name} delay={index * 0.08}>
                <Link
                  to={`/rooms?district=${encodeURIComponent(area.name)}`}
                  className="area-card group"
                >
                  <SafeImage
                    src={area.image}
                    alt={`Không gian sống tại ${area.name}`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="relative z-1 flex w-full items-end justify-between p-6 text-white">
                    <div>
                      <h3 className="mb-1 text-2xl font-semibold">{area.name}</h3>
                      <p className="text-xs text-white/85">{area.note}</p>
                    </div>
                    <ArrowRightOutlined />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="section-space">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">GÓC NHỎ SINH VIÊN</span>
              <h2>Ở hay hơn, sống vui hơn</h2>
              <p>Chút kinh nghiệm nhỏ cho hành trình tự lập thật lớn.</p>
            </div>
            <Link to="/blog" className="text-link">
              Ghé thăm blog <ArrowRightOutlined />
            </Link>
          </Reveal>
          <HorizontalRail className="blog-rail" label="Bài viết sinh viên, kéo ngang để xem thêm">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </HorizontalRail>
        </section>
        <Reveal>
          <section className="cta-banner">
            <div>
              <span className="eyebrow !text-[#e7c9ab]">BẠN ĐÃ SẴN SÀNG CHƯA?</span>
              <h2>
                Một căn phòng nhỏ.
                <br />
                Cả một hành trình phía trước.
              </h2>
              <p>Cùng tìm nơi mà bạn có thể gọi là nhà.</p>
            </div>
            <Link to="/rooms" className="cta-button">
              <SearchOutlined /> Tìm chốn về của bạn <ArrowRightOutlined />
            </Link>
            <span aria-hidden="true" className="cta-spark">
              ✳
            </span>
          </section>
        </Reveal>
      </div>
      {quizOpen && <RoomMatchQuiz open onClose={() => setQuizOpen(false)} />}
    </>
  )
}
