import { useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from '../../../shared/lib/storage'
import { FavoritesContext } from '../hooks/favorites.context'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(() =>
    readStorage<number[]>(
      'minihome:favorites',
      [],
      (value): value is number[] =>
        Array.isArray(value) && value.every((id) => Number.isInteger(id)),
    ),
  )
  const toggle = (id: number) =>
    setIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      writeStorage('minihome:favorites', next)
      return next
    })
  return <FavoritesContext.Provider value={{ ids, toggle }}>{children}</FavoritesContext.Provider>
}
