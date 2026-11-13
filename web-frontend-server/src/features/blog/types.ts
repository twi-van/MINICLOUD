export interface BlogPost {
  id: string
  htmlFile: `blog${number}.html`
  title: string
  category: string
  excerpt: string
  imageUrl: string
  date: string
  readTime: number
  sections: { title: string; content: string }[]
}
