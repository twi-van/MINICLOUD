import { Alert, Button, Skeleton } from 'antd'

export function ResourceState({
  loading,
  error,
  retry,
}: {
  loading: boolean
  error?: string
  retry: () => void
}) {
  if (loading)
    return (
      <div
        className="grid gap-6 py-8 md:grid-cols-3"
        aria-label="Đang tải dữ liệu"
        aria-busy="true"
      >
        {[1, 2, 3].map((key) => (
          <div key={key} className="rounded-2xl border border-slate-200 p-5">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ))}
      </div>
    )
  if (error)
    return (
      <Alert
        type="error"
        showIcon
        title="Chưa tải được dữ liệu"
        description={error}
        action={<Button onClick={retry}>Thử lại</Button>}
      />
    )
  return null
}
