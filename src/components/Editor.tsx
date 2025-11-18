"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange, placeholder }: EditorProps) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start writing your story...",
      minHeight: 500,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "|",
        "paragraph",
        "align",
        "|",
        "image",
        "link",
        "|",
        "undo",
        "redo",
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      toolbarAdaptive: false,
    }),
    [placeholder]
  );

  return <JoditEditor ref={editor} value={value} config={config} onBlur={onChange} />;
}
