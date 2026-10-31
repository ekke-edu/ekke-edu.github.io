import { useEffect, useRef } from "react";
import type { Language, Copy } from "../content";

type Props = {
  open: boolean;
  language: Language;
  copy: Copy;
  onClose: () => void;
};

export default function ChatDialog({ open, language, copy, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog ref={dialog} className="chat-dialog" aria-label={copy.openChat} onClose={onClose}>
      <div className="chat-dialog-head">
        <strong>EKKE {language === "hu" ? "egyetemi asszisztens" : "university assistant"}</strong>
        <div className="chat-dialog-actions">
          <a href="https://ekke-mcp-chat.onrender.com/" target="_blank" rel="noopener noreferrer">
            {copy.separateTab}
          </a>
          <button type="button" onClick={onClose} aria-label={copy.closeChat}>×</button>
        </div>
      </div>
      {open && (
        <iframe
          title="EKKE university assistant chat"
          src="https://ekke-mcp-chat.onrender.com/?embed=1"
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="clipboard-write"
        />
      )}
    </dialog>
  );
}
