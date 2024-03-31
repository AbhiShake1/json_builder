"use client"

import Editor, { useMonaco, BeforeMount, OnMount, OnValidate } from "@monaco-editor/react";
import { RefObject, useCallback, useEffect, useRef } from "react";

export function FlutterOutput() {
  const monaco = useMonaco()

  const ref = useRef()
  const prettify = useCallback(() => {
    // editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  useEffect(() => {
    monaco?.editor.defineTheme("json-builder-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        'editor.background': 'transparent',
      },
    })
  }, [monaco?.editor])

  return <Editor options={{
    lineNumbers: "off",
    bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
    scrollbar: { vertical: "hidden" },
    codeLens: false,
    rulers: [],
  }}
    language="json"
    theme="json-builder-dark"
    onMount={e => {
      // ref.current = e;
    }
    }
  />
}

