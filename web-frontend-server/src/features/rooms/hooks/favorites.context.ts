import { createContext, useContext } from 'react'
export const FavoritesContext = createContext<{ ids: number[]; toggle: (id: number) => void }>({
  ids: [],
  toggle: () => {},
})
export const useFavorites = () => useContext(FavoritesContext)
