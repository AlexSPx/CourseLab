import Quill from "quill";
import { useState, useEffect, useCallback } from "react";

export default function Description({
  description,
  label,
  placeholder,
}: {
  description: string;
  label: string;
  placeholder: string;
}) {
  const [quill, setQuill] = useState<Quill>();

  useEffect(() => {
    if (!quill) return;
    quill.setContents(JSON.parse(description));
  }, [description, quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (typeof window === "undefined") return;
    if (wrapper === null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "bubble",
      readOnly: true,
      placeholder,
      bounds: "journal-scroll",
    });
    setQuill(q);
  }, []);

  return (
    <div className="block p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
      <span className="font-bold text-2xl ">{label}</span>
      <div ref={wrapperRef}></div>
    </div>
  );
}
