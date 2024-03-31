import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SchemaState {
  schema: string
  setSchema: (schema: string) => void
}

export const useSchemaStore = create<SchemaState>()(
  devtools(
    persist(
      (set) => ({
        schema: '',
        setSchema: (schema) => set({ schema }),
      }),
      {
        name: 'schema-storage',
      },
    ),
  ),
)
