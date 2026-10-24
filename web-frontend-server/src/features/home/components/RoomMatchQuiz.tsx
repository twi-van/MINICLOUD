import { useState } from 'react'
import { Button, Modal, Progress } from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ThunderboltFilled,
} from '@ant-design/icons'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { districts } from '../../rooms/lib/room.utils'

const questions = [
  {
    title: 'Căn phòng mơ ước của bạn?',
    subtitle: 'Bắt đầu bằng chiếc vibe bạn thích nhất.',
    options: [
      {
        label: 'Studio riêng tư',
        detail: 'Một vũ trụ nhỏ, đủ thứ mình cần.',
        value: 'Studio',
        emoji: '🪴',
      },
      {
        label: 'Phòng trọ gọn xinh',
        detail: 'Vừa đủ tiện nghi, dư tiền đi chill.',
        value: 'Phòng trọ',
        emoji: '🛋️',
      },
      {
        label: 'Có gác, có góc riêng',
        detail: 'Tầng trên mơ mộng, tầng dưới học bài.',
        value: 'Có gác',
        emoji: '☁️',
      },
    ],
  },
  {
    title: 'Ví của bạn thấy sao?',
    subtitle: 'Chọn mức tiền thuê mỗi tháng, chưa gồm phí dịch vụ.',
    options: [
      { label: 'Dưới 3 triệu', detail: 'Tiết kiệm mà vẫn đúng gu.', value: 'under3', emoji: '💸' },
      {
        label: 'Từ 3 đến 4 triệu',
        detail: 'Đầu tư thêm chút cho tổ ấm.',
        value: '3to4',
        emoji: '✨',
      },
      {
        label: 'Trên 4 triệu',
        detail: 'Ưu tiên không gian thật thoải mái.',
        value: 'over4',
        emoji: '🪩',
      },
    ],
  },
  {
    title: 'Bạn muốn cắm rễ ở đâu?',
    subtitle: 'Gần trường, gần bạn hay gần quán cà phê quen?',
    options: [
      { label: 'Ở đâu cũng được', detail: 'Cứ hợp gu là mình đến.', value: '', emoji: '🧭' },
      ...districts.map((district) => ({
        label: district,
        detail: 'TP. Hồ Chí Minh',
        value: district,
        emoji: '📍',
      })),
    ],
  },
]

export function RoomMatchQuiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(string | undefined)[]>([])
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const question = questions[step]
  const choose = (value: string) =>
    setAnswers((current) => {
      const next = [...current]
      next[step] = value
      return next
    })
  const finish = () => {
    const params = new URLSearchParams()
    if (answers[0]) params.set('type', answers[0])
    if (answers[1]) params.set('budget', answers[1])
    if (answers[2]) params.set('district', answers[2])
    onClose()
    navigate(`/rooms?${params}`)
  }
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      className="quiz-modal"
      title={
        <span className="quiz-label">
          <ThunderboltFilled /> VIBE CHECK · {step + 1}/3
        </span>
      }
    >
      <Progress
        percent={((step + 1) / 3) * 100}
        showInfo={false}
        strokeColor="#203b4b"
        railColor="#eae6e0"
        size="small"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: reduced ? 0 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduced ? 0 : -16 }}
          transition={{ duration: 0.18 }}
        >
          <h2 className="mb-2 mt-6 text-2xl font-bold">{question.title}</h2>
          <p className="mb-6 text-sm leading-6 text-muted">{question.subtitle}</p>
          <div className={`quiz-options ${step === 2 ? 'two-columns' : ''}`}>
            {question.options.map((option) => (
              <button
                key={option.value}
                className={`quiz-option ${answers[step] === option.value ? 'selected' : ''}`}
                onClick={() => choose(option.value)}
                aria-pressed={answers[step] === option.value}
              >
                <span className="quiz-emoji" aria-hidden="true">
                  {option.emoji}
                </span>
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
                <span className="quiz-check" aria-hidden="true">
                  {answers[step] === option.value && <CheckOutlined />}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-7 flex items-center justify-between gap-3">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          size="large"
          disabled={answers[step] === undefined}
          onClick={() => (step === 2 ? finish() : setStep(step + 1))}
        >
          {step === 2 ? 'Xem phòng hợp gu' : 'Tiếp nè'} <ArrowRightOutlined />
        </Button>
      </div>
      <p className="mt-4 text-center text-[11px] text-muted">
        Gợi ý theo bộ lọc bạn chọn. Gu của bạn, bạn quyết định.
      </p>
    </Modal>
  )
}
