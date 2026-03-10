import { useCallback } from 'react'
import { useDatabase } from './useDatabase'
import { useClipboard } from './useClipboard'
import { useClipboardStore } from '@/stores/clipboardStore'

export const useClipboardActions = () => {
  const { deleteItem: dbDeleteItem, updateItem: dbUpdateItem, moveItemToCategory } = useDatabase()
  const { pasteItem } = useClipboard()
  
  const {
    items,
    deleteItem: storeDeleteItem,
    updateItem: storeUpdateItem,
  } = useClipboardStore()

  const handleItemClick = useCallback(async (id: number) => {
    const success = await pasteItem(id)
    if (success) {
      console.log(`Item ${id} pasted successfully`)
    } else {
      console.error(`Failed to paste item ${id}`)
    }
  }, [pasteItem])

  const handleDeleteItem = useCallback(async (id: number) => {
    const success = await dbDeleteItem(id)
    if (success) {
      storeDeleteItem(id)
    }
  }, [dbDeleteItem, storeDeleteItem])

  const handleToggleFavorite = useCallback(async (id: number) => {
    const item = items.find(item => item.id === id)
    if (item) {
      const success = await dbUpdateItem(id, { is_favorite: !item.is_favorite })
      if (success) {
        storeUpdateItem(id, { is_favorite: !item.is_favorite })
      }
    }
  }, [items, dbUpdateItem, storeUpdateItem])

  const handleTogglePin = useCallback(async (id: number) => {
    const item = items.find(item => item.id === id)
    if (item) {
      const success = await dbUpdateItem(id, { is_pinned: !item.is_pinned })
      if (success) {
        storeUpdateItem(id, { is_pinned: !item.is_pinned })
      }
    }
  }, [items, dbUpdateItem, storeUpdateItem])

  const handleMoveToCategory = useCallback(async (itemId: number, categoryId?: number) => {
    const success = await moveItemToCategory(itemId, categoryId)
    if (success) {
      // Update the item in the store
      const item = items.find(item => item.id === itemId)
      if (item) {
        storeUpdateItem(itemId, { category_id: categoryId })
      }
    }
  }, [moveItemToCategory, items, storeUpdateItem])

  return {
    handleItemClick,
    handleDeleteItem,
    handleToggleFavorite,
    handleTogglePin,
    handleMoveToCategory,
  }
}
