import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage, sendMessageToUser } from "@/lib/api";
import { toast } from "sonner";

interface ComposeMessageModalProps {
  open: boolean;
  onClose: () => void;
  recipient?: 'coach' | 'physio';
  recipientUserId?: string;
  titleOverride?: string;
}

export function ComposeMessageModal({ open, onClose, recipient, recipientUserId, titleOverride }: ComposeMessageModalProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const MAX_CHARS = 500;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSend = async () => {
    try {
      setIsSending(true);
      let notification;
      if (recipientUserId) {
        ({ notification } = await sendMessageToUser({ recipientUserId, message: text, attachments: files }));
      } else if (recipient) {
        ({ notification } = await sendMessage({ recipient, message: text, attachments: files }));
      } else {
        throw new Error('No recipient specified');
      }
      toast.success("Message sent. Recipient notified.");
      // Reset
      setText("");
      setFiles([]);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const onTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isSubmit = (e.ctrlKey || e.metaKey) && e.key === 'Enter';
    if (isSubmit && !isSending && (text.trim().length > 0 || files.length > 0)) {
      e.preventDefault();
      onSend();
    }
  };

  const title = titleOverride || (recipient === 'coach' ? 'Contact Coach' : 'Contact Physiotherapist');

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Use the form below to compose your reply. Press <span className="font-medium">Ctrl/⌘ + Enter</span> to send.</p>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={onTextKeyDown}
            rows={4}
            placeholder="Write your message..."
            className="w-full rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={MAX_CHARS}
            autoFocus
          />
          <div className="flex items-center justify-end mt-1">
            <span className="text-xs text-muted-foreground">{text.length}/{MAX_CHARS}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Attachments</label>
          <Input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf,.doc,.docx"
            onChange={onFileChange}
          />
          <p className="mt-1 text-xs text-muted-foreground">Images, videos, PDFs or docs. Max 50MB each.</p>
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-muted">
                  <span className="truncate max-w-[180px]">{file.name}</span>
                  <span className="text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                  <button className="text-destructive hover:underline" onClick={() => removeFile(idx)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
          <Button onClick={onSend} disabled={isSending || (text.trim().length === 0 && files.length === 0)}>
            {isSending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
