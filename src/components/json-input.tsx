"use client"

import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useSchemaStore } from "~/stores/schema";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function JsonInput({ componentId, schema: serverSchema }: { componentId: number, schema: string | null }) {
  const router = useRouter()
  const [outOfSyncMsg, setOutOfSyncMsg] = useState<string | undefined>()
  const { schema: s, setSchema } = useSchemaStore()
  const { schema = "", localUpdatedAt } = s[componentId] ?? {}
  const syncMutation = api.component.sync.useMutation({
    onSuccess: (d) => {
      if (!d) return

      setSchema(componentId, d.schema ?? "", d.updatedAt ?? undefined)

      toast.success("Synced with server")
    },
    onError: (e) => {
      if (e.data?.code === "CONFLICT") {
        setOutOfSyncMsg(e.message)
      }
    },
  })

  return <>
    <AlertDialog open={!!outOfSyncMsg} onOpenChange={() => setOutOfSyncMsg(undefined)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Local changes out of sync</AlertDialogTitle>
          <AlertDialogDescription>
            {outOfSyncMsg}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            setOutOfSyncMsg(undefined)
            router.refresh()
            setSchema(componentId, serverSchema ?? "")
          }}>Sync</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <div className="relative flex h-full flex-col">
      <Button variant="outline" loading={syncMutation.isPending} className="absolute right-6 z-50 top-3 space-x-2" onClick={() => {
        syncMutation.mutate({ schema, componentId, localUpdatedAt })
      }}>
        Sync
      </Button>
      <Editor
        onChange={e => e && setSchema(componentId, e)}
        language="json"
        theme="vs-dark"
        value={schema}
      />
    </div>
  </>
}

