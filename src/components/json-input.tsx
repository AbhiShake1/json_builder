"use client"

import Editor, { useMonaco, BeforeMount, OnMount, OnValidate } from "@monaco-editor/react";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { useSchemaStore } from "~/stores/schema";

export function JsonInput() {
  const monaco = useMonaco()
  const { schema, setSchema } = useSchemaStore()

  const ref = useRef(null)
  const prettify = useCallback(() => {
    // editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  return <Editor options={{
    lineNumbers: "off",
    bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
    scrollbar: { vertical: "hidden" },
    codeLens: false,
    rulers: [],
  }}
    onChange={e => e && setSchema(e)}
    language="json"
    theme="vs-dark"
    value={schema}
    onMount={e => {
      // ref.current = e;
      console.log(monaco, e, 'monacoo')
      monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        comments: "ignore",
        allowComments: true,
        trailingCommas: "ignore",
      });
    }}
  />
}

