"use client"

import Editor from "@monaco-editor/react";
import {useEffect, useState} from "react";
import {useSchemaStore} from "~/stores/schema";
import {Button} from "./ui/button";
import {api} from "~/trpc/react";
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
import {useRouter} from "next/navigation";
import {toast} from "sonner";
// @ts-expect-error opting out of type safety
import constrainedEditor from "constrained-editor-plugin";

export function JsonInput({componentId, schema: serverSchema, serverUpdatedAt}: {
    componentId: number,
    schema: string | null,
    serverUpdatedAt: Date | null
}) {
    const router = useRouter()
    const [outOfSyncMsg, setOutOfSyncMsg] = useState<string | undefined>()
    const {schema: s, setSchema} = useSchemaStore()
    const {schema, localUpdatedAt} = s[componentId] ?? {}
    useEffect(() => {
        if (!schema) {
            setSchema(componentId, serverSchema ?? "", serverUpdatedAt ?? undefined)
        }
    }, [componentId, schema, serverSchema, serverUpdatedAt])

    const syncMutation = api.component.sync.useMutation({
        onSuccess: (d) => {
            if (!d) return

            setSchema(componentId, d.schema ?? "", d.updatedAt ?? undefined)

            toast.success("Synced with server")
        },
        onError: (e) => {
            console.log(e)
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
            <Button variant="default" loading={syncMutation.isPending} className="absolute right-6 z-50 top-3 space-x-2"
                    onClick={() => {
                        syncMutation.mutate({
                            schema: schema ?? "",
                            componentId,
                            localUpdatedAt: localUpdatedAt && new Date(localUpdatedAt.toString())
                        })
                    }}>
                Sync
            </Button>
            <Editor
                value={schema}
                onChange={e => {
                    if (!e) return;

                    setSchema(componentId, e)
                }}
                language="json"
                theme="vs-dark"
                width="100%"
                height="100%"
                options={{
                    minimap: {
                        enabled: false
                    },
                }}
                onMount={(editor, monaco) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
                    const constrainedInstance = constrainedEditor(monaco);
                    const model = editor.getModel();

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                    constrainedInstance.initializeIn(editor);

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                    constrainedInstance.addRestrictionsTo(model, [
                        {
                            range: [5, 9, 5, 9],
                            allowMultiline: true,
                        }
                    ])
                }}
            />
        </div>
    </>
}

