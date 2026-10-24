import { useState } from 'react'
import { Button, Select } from 'antd'
import {
  EnvironmentOutlined,
  SearchOutlined,
  WalletOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { districts, roomTypes } from '../lib/room.utils'

export function RoomSearch() {
  const navigate = useNavigate()
  const [district, setDistrict] = useState<string>()
  const [budget, setBudget] = useState<string>()
  const [type, setType] = useState<string>()
  return (
    <form
      className="room-search"
      onSubmit={(event) => {
        event.preventDefault()
        const params = new URLSearchParams()
        if (district) params.set('district', district)
        if (budget) params.set('budget', budget)
        if (type) params.set('type', type)
        navigate(`/rooms?${params}`)
      }}
    >
      <div className="search-field">
        <label htmlFor="search-district">
          <EnvironmentOutlined /> Khu vực
        </label>
        <Select
          id="search-district"
          variant="borderless"
          allowClear
          placeholder="Bạn muốn ở đâu?"
          value={district}
          onChange={setDistrict}
          options={districts.map((value) => ({ value, label: value }))}
        />
      </div>
      <div className="search-field">
        <label htmlFor="search-budget">
          <WalletOutlined /> Ngân sách
        </label>
        <Select
          id="search-budget"
          variant="borderless"
          allowClear
          placeholder="Khoảng giá phù hợp"
          value={budget}
          onChange={setBudget}
          options={[
            { value: 'under3', label: 'Dưới 3 triệu' },
            { value: '3to4', label: '3 – 4 triệu' },
            { value: 'over4', label: 'Trên 4 triệu' },
          ]}
        />
      </div>
      <div className="search-field">
        <label htmlFor="search-type">
          <HomeOutlined /> Loại phòng
        </label>
        <Select
          id="search-type"
          variant="borderless"
          allowClear
          placeholder="Tất cả loại phòng"
          value={type}
          onChange={setType}
          options={roomTypes.map((value) => ({ value, label: value }))}
        />
      </div>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        icon={<SearchOutlined />}
        className="!h-13 !px-7"
      >
        Tìm phòng
      </Button>
    </form>
  )
}
