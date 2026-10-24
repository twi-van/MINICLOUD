import { Breadcrumb, Button, Result } from 'antd'
import { ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'
import { posts } from '../data/posts'
import { SafeImage } from '../../../shared/components/SafeImage'
import { BlogCard } from '../components/BlogCard'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const post = posts.find((item) => item.id === slug)
  if (!post)
    return (
      <Result
        status="404"
        title="Không tìm thấy bài viết"
        extra={
          <Link to="/blog">
            <Button type="primary">Về blog</Button>
          </Link>
        }
      />
    )
  return (
    <div className="page-container pb-16 pt-8">
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to="/blog">Blog</Link> },
          { title: post.category },
        ]}
      />
      <article className="mx-auto max-w-200 py-10">
        <span className="eyebrow">{post.category}</span>
        <h1 className="mb-5 mt-4 text-3xl font-semibold leading-tight md:text-[42px]">
          {post.title}
        </h1>
        <div className="mb-7 flex items-center gap-5 text-sm text-muted">
          <span>MiniHome Editorial</span>
          <span>
            {new Intl.DateTimeFormat('vi-VN').format(new Date(`${post.date}T12:00:00+07:00`))}
          </span>
          <span>
            <ClockCircleOutlined /> {post.readTime} phút đọc
          </span>
        </div>
        <SafeImage
          src={post.imageUrl}
          alt={post.title}
          eager
          className="aspect-[1.8] w-full rounded-2xl object-cover"
        />
        <p className="my-8 text-lg leading-8 text-muted">{post.excerpt}</p>
        {post.sections.map((section) => (
          <section key={section.title} className="my-8">
            <h2 className="mb-4 text-2xl font-semibold">{section.title}</h2>
            <p className="whitespace-pre-line text-[16px] leading-8 text-muted">
              {section.content}
            </p>
          </section>
        ))}
        <Link to="/blog" className="text-link">
          <ArrowLeftOutlined /> Về góc nhỏ sinh viên
        </Link>
      </article>
      <div className="border-t border-line pt-10">
        <h2 className="mb-7 text-2xl font-semibold">Thêm một chút cảm hứng</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {posts
            .filter((item) => item.id !== post.id)
            .map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
        </div>
      </div>
    </div>
  )
}
