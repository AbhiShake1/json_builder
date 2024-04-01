"use client"

import Editor, {useMonaco} from "@monaco-editor/react";
import {useCallback, useRef} from "react";
import {useSchemaStore} from "~/stores/schema";
import {editor} from "monaco-editor";
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

const options = {
    lineNumbers: "off",
    bracketPairColorization: {enabled: true, independentColorPoolPerBracketType: true},
    scrollbar: {vertical: "hidden"},
    codeLens: false,
    rulers: [],
} satisfies IStandaloneEditorConstructionOptions

export function JsonInput({componentId}: { componentId: number }) {
    const monaco = useMonaco()
    const {schema: s, setSchema} = useSchemaStore()
    const schema = s[componentId]

    const ref = useRef(null)
    const prettify = useCallback(() => {
        // editorRef.current?.getAction("editor.action.formatDocument")?.run();
    }, []);

    return <Editor options={options}
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
}

