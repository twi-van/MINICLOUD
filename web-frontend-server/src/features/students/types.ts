export interface Student {
  id: number
  name: string
  major: string
  gpa: number
}
export function isStudent(value: unknown): value is Student {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.id === 'number' &&
    typeof row.name === 'string' &&
    typeof row.major === 'string' &&
    typeof row.gpa === 'number'
  )
}
