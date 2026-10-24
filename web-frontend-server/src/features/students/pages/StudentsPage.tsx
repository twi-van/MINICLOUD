import { useState } from 'react'
import { Avatar, Input, Select, Table, Tag } from 'antd'
import { BookOutlined, SearchOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons'
import { studentsService } from '../services/students.service'
import { useResource } from '../../../shared/hooks/useResource'
import { ResourceState } from '../../../shared/components/ResourceState'
import { StudentStatArtwork } from '../components/StudentStatArtwork'
import { Reveal } from '../../../shared/components/Reveal'
import { normalize } from '../../../shared/lib/text'

const loadStudents = (signal: AbortSignal) => studentsService.list(signal)
const majorLabels: Record<string, string> = {
  CNTT: 'Công nghệ thông tin',
  KTPM: 'Kỹ thuật phần mềm',
  KHMT: 'Khoa học máy tính',
}

export default function StudentsPage() {
  const resource = useResource(loadStudents)
  const [query, setQuery] = useState('')
  const [major, setMajor] = useState<string>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const students = resource.data || []
  const majors = [...new Set(students.map((student) => student.major))]
  const filtered = students.filter(
    (student) =>
      normalize(student.name).includes(normalize(query)) && (!major || student.major === major),
  )
  const stats = [
    { label: 'Sinh viên', value: students.length, icon: <TeamOutlined /> },
    { label: 'Chuyên ngành', value: majors.length, icon: <BookOutlined /> },
    {
      label: 'GPA trung bình',
      value: students.length
        ? (students.reduce((sum, row) => sum + row.gpa, 0) / students.length).toFixed(2)
        : '—',
      icon: <TrophyOutlined />,
    },
  ]
  return (
    <div className="page-container students-page min-h-160 pb-16">
      <section className="student-hero">
        <div className="page-intro">
          <span className="eyebrow">CÙNG NHAU TRƯỞNG THÀNH</span>
          <h1>
            Gặp những người bạn <span>đồng hành</span>
          </h1>
          <p>Thông tin sinh viên trong không gian MiniHome.</p>
        </div>
      </section>
      <ResourceState {...resource} />
      {resource.data && (
        <>
          <div className="student-stats mb-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 0.08}
                className={`student-stat student-stat-${index + 1} flex items-center gap-5 rounded-xl border border-line bg-sand/50 p-6`}
              >
                <span className="benefit-icon">{stat.icon}</span>
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <strong className="mt-1 block text-3xl font-semibold">{stat.value}</strong>
                </div>
                <span className="student-stat-watermark" aria-hidden="true">
                  <StudentStatArtwork index={index} />
                </span>
              </Reveal>
            ))}
          </div>
          <section className="student-directory overflow-hidden rounded-2xl border border-line bg-white">
            <div className="student-toolbar flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
              <h2 className="text-lg font-semibold">
                Danh sách sinh viên{' '}
                <span className="ml-2 text-sm font-normal text-muted">({filtered.length})</span>
              </h2>
              <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                <Input
                  className="!w-full sm:!w-60"
                  placeholder="Tìm tên sinh viên…"
                  aria-label="Tìm tên sinh viên"
                  prefix={<SearchOutlined />}
                  allowClear
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setCurrentPage(1)
                  }}
                />
                <Select
                  className="!w-full sm:!w-55"
                  placeholder="Tất cả chuyên ngành"
                  aria-label="Lọc theo chuyên ngành"
                  allowClear
                  value={major}
                  onChange={(value) => {
                    setMajor(value)
                    setCurrentPage(1)
                  }}
                  options={majors.map((value) => ({ value, label: majorLabels[value] || value }))}
                />
              </div>
            </div>
            <Table
              rowKey="id"
              tableLayout="fixed"
              dataSource={filtered}
              scroll={{ x: 640 }}
              pagination={{
                current: currentPage,
                pageSize,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50],
                showTotal: (total, range) =>
                  total ? `${range[0]}–${range[1]} / ${total} sinh viên` : '0 sinh viên',
                onChange: (nextPage, nextSize) => {
                  setCurrentPage(nextSize !== pageSize ? 1 : nextPage)
                  setPageSize(nextSize)
                },
              }}
              locale={{ emptyText: 'Không tìm thấy sinh viên phù hợp.' }}
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  width: 80,
                  render: (id: number) => (
                    <span className="text-muted">{String(id).padStart(2, '0')}</span>
                  ),
                },
                {
                  title: 'Họ và tên',
                  dataIndex: 'name',
                  width: 'calc((100% - 230px) / 2)',
                  render: (name: string) => (
                    <div className="flex items-center gap-3">
                      <Avatar className="student-avatar">{name.charAt(0)}</Avatar>
                      <span className="font-medium">{name}</span>
                    </div>
                  ),
                },
                {
                  title: 'Chuyên ngành',
                  dataIndex: 'major',
                  width: 'calc((100% - 230px) / 2)',
                  render: (value: string) => (
                    <Tag className="student-major">{majorLabels[value] || value}</Tag>
                  ),
                },
                {
                  title: 'GPA / 4.0',
                  align: 'right',
                  dataIndex: 'gpa',
                  width: 150,
                  sorter: (a, b) => a.gpa - b.gpa,
                  render: (value: number) => (
                    <span className="student-gpa font-semibold text-navy">
                      <span className="student-gpa-value">{value.toFixed(2)}</span>{' '}
                      <span className="ml-2 text-xs text-muted">/ 4.0</span>
                    </span>
                  ),
                },
              ]}
            />
          </section>
        </>
      )}
    </div>
  )
}
