import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'

interface SchemaState {
    schema: Record<number, string>,
    setSchema: (componentId: number, schema: string) => void
}

export const useSchemaStore = create<SchemaState>()(
    devtools(
        persist(
            (set, get) => ({
                schema: {},
                setSchema: (componentId, schema) => {
                    return set({
                        schema: {
                            ...get().schema,
                            [componentId]: schema
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
