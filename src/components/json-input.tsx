"use client"

import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useRef, useState } from "react";
import { useSchemaStore } from "~/stores/schema";
import { editor } from "monaco-editor";
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
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

const options = {
  lineNumbers: "off",
  bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
  scrollbar: { vertical: "hidden" },
  codeLens: false,
  rulers: [],
} satisfies IStandaloneEditorConstructionOptions

export function JsonInput({ componentId }: { componentId: number }) {
  const router = useRouter()
  const [outOfSyncMsg, setOutOfSyncMsg] = useState<string | undefined>()
  const syncMutation = api.component.sync.useMutation({
    onSuccess: (d) => {
      if (!d) return

      router.refresh()
      toast.success("Synced with server")
    },
    onError: (e) => {
      if (e.data?.code === "CONFLICT") {
        setOutOfSyncMsg(e.message)
      }
    },
  })

  const monaco = useMonaco()
  const { schema: s, setSchema } = useSchemaStore()
  const { schema = "", localUpdatedAt } = s[componentId] ?? {}

  const ref = useRef(null)
  const prettify = useCallback(() => {
    // editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

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
          <AlertDialogAction>Sync</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <div className="relative flex h-full flex-col">
      <Button variant="outline" loading={syncMutation.isPending} className="absolute right-6 z-50 top-3 space-x-2" onClick={async () => {
        syncMutation.mutate({ schema, componentId, localUpdatedAt })
      }}>
        Sync
      </Button>
      <Editor options={options}
        onChange={e => e && setSchema(componentId, e)}
        language="json"
        theme="vs-dark"
        value={schema}
        onMount={e => {
          // ref.current = e;
          monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            comments: "ignore",
            allowComments: true,
            trailingCommas: "ignore",
          });
        }}
      />
    </div>
  </>
}

