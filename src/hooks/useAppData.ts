import { useEffect, useCallback } from 'react'
import { useDatabase } from './useDatabase'
import { useHotkey } from './useHotkey'
import { useClipboardStore } from '@/stores/clipboardStore'
import { mockData } from '@/utils/mockData'

export const useAppData = () => {
  const { loadItems, getCategories } = useDatabase()
  const { onShowPanel } = useHotkey()

  const {
    setItems,
    setCategories,
    setLoading,
  } = useClipboardStore()

  const fetchData = useCallback(async () => {
    const isWebEnv = !window.electronAPI

    if (isWebEnv) {
      setItems(mockData)
    } else {
      const loadedItems = await loadItems()
      setItems(loadedItems)
      const cats = await getCategories()
      setCategories(cats)
    }
    setLoading(false)
  }, [loadItems, setItems, setLoading, getCategories, setCategories])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const cleanup = onShowPanel(() => {
      fetchData()
    })
    return cleanup
  }, [onShowPanel, fetchData])

  return {
    fetchData,
  }
}
