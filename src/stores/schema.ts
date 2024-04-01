import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SchemaState {
  schema: Record<number, { schema: string, localUpdatedAt?: Date }>,
  setSchema: (componentId: number, schema: string, localUpdatedAt?: Date) => void
}

export const useSchemaStore = create<SchemaState>()(
  devtools(
    persist(
      (set, get) => ({
        schema: {},
        setSchema: (componentId, schema, localUpdatedAt) => {
          return set({
            schema: {
              ...get().schema,
              [componentId]: {
                ...get().schema[componentId],
                schema,
                ...{ localUpdatedAt: localUpdatedAt ?? get().schema[componentId]?.localUpdatedAt }
              }
            }
          })
        },
      }),
      {
        name: `schema-storage-`,
      },
    ),
  ),
)
