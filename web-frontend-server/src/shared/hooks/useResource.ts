import { useEffect, useState } from 'react'

export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<{
    data?: T
    loading: boolean
    error?: string
    source?: typeof loader
  }>({
    loading: true,
  })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    loader(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, source: loader })
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : 'Đã có lỗi xảy ra.',
            source: loader,
          })
        }
      },
    )
    return () => controller.abort()
  }, [loader, attempt])
  return {
    ...(state.source === loader ? state : { loading: true }),
    retry: () => {
      setState({ loading: true })
      setAttempt((value) => value + 1)
    },
  }
}
