import { ArrowUpOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { SafeImage } from '../../../shared/components/SafeImage'
import type { BlogPost } from '../types'
import { motion, useReducedMotion } from 'motion/react'

export function BlogCard({ post }: { post: BlogPost }) {
  const reduced = useReducedMotion()
  return (
    <motion.article
      className={`blog-card group ${post.id === 'ngan-sach-sinh-vien' ? 'blog-card-featured' : ''}`}
      whileHover={reduced ? undefined : { y: -5 }}
    >
      <Link to={`/blog/${post.id}`} className="blog-card-image block overflow-hidden">
        <SafeImage
          src={post.imageUrl}
          alt={post.title}
          className="aspect-[1.6] w-full object-cover transition duration-200 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-meta flex items-center justify-between text-xs">
          <span className="font-semibold text-brand">{post.category}</span>
          <span className="text-muted">
            <ClockCircleOutlined /> {post.readTime} phút đọc
          </span>
        </div>
        <h3 className="my-3 text-xl font-semibold leading-snug">
          <Link to={`/blog/${post.id}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <Link
          to={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy"
        >
          Đọc bài viết <ArrowUpOutlined className="rotate-45" />
        </Link>
      </div>
    </motion.article>
  )
}
