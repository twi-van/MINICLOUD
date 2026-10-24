import { useState } from 'react'
import { Button, Empty, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { posts } from '../data/posts'
import { BlogCard } from '../components/BlogCard'
import { normalize } from '../../../shared/lib/text'

export default function BlogPage() {
  const [category, setCategory] = useState('Tất cả')
  const [query, setQuery] = useState('')
  const filtered = posts.filter(
    (post) =>
      (category === 'Tất cả' || category === post.category) &&
      normalize(`${post.title} ${post.excerpt}`).includes(normalize(query)),
  )
  return (
    <div className="page-container blog-page min-h-150 pb-18">
      <div className="page-intro text-center">
        <span className="eyebrow">GÓC NHỎ SINH VIÊN</span>
        <h1>
          Ở hay hơn, <span>sống vui hơn.</span>
        </h1>
        <p>Những câu chuyện và kinh nghiệm nhỏ, cùng bạn trên hành trình tự lập.</p>
      </div>
      <div className="blog-toolbar mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['Tất cả', ...new Set(posts.map((post) => post.category))].map((value) => (
            <Button
              key={value}
              type={category === value ? 'primary' : 'default'}
              onClick={() => setCategory(value)}
            >
              {value}
            </Button>
          ))}
        </div>
        <Input
          className="!w-full sm:!w-64"
          prefix={<SearchOutlined />}
          aria-label="Tìm bài viết"
          placeholder="Tìm một bài viết…"
          allowClear
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {filtered.length ? (
        <div className="blog-editorial-grid">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Empty description="Chưa tìm thấy bài viết phù hợp." />
      )}
    </div>
  )
}
