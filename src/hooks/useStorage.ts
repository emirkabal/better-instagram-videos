import { useEffect, useState } from "react"

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    chrome.storage.sync.get([key], (result) => {
      setValue(result[key] ?? defaultValue)
    })

    const listener = (changes: {
      [key: string]: chrome.storage.StorageChange
    }) => {
      if (changes[key]) {
        setValue(changes[key].newValue ?? defaultValue)
      }
    }

    chrome.storage.sync.onChanged.addListener(listener)
    return () => {
      chrome.storage.sync.onChanged.removeListener(listener)
    }
  }, [key, defaultValue])

  const updateValue = (newValue: T) => {
    chrome.storage.sync.set({ [key]: newValue })
    setValue(newValue)
  }

  return [value, updateValue] as const
}
