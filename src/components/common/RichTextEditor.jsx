import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { List, ListOrdered } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * RichTextEditor — phiên bản TỐI THIỂU theo yêu cầu BUG-015.
 *
 * Phạm vi CHỦ ĐÍCH giới hạn ở:
 *  - Giữ xuống dòng / đoạn văn (paragraph, hard break)
 *  - Bullet list (•)
 *  - Numbered list (1. 2. 3.)
 *
 * KHÔNG bật: bold/italic/underline, màu chữ, font size, hyperlink, heading,
 * blockquote, code block... — vì phạm vi đã thống nhất chỉ cần xuống dòng +
 * list. Muốn mở rộng sau này, thêm extension tương ứng vào StarterKit.configure()
 * và thêm nút vào toolbar bên dưới.
 *
 * Khi paste nội dung từ Word/Gmail/Outlook/Google Docs, Tiptap tự động đọc
 * HTML clipboard và giữ lại các phần tử mà schema hiện tại hỗ trợ (đoạn văn,
 * line break, list) — các định dạng khác (màu, bold...) sẽ tự bị "rớt" vì
 * StarterKit ở đây đã tắt heading/bold/italic, đúng theo yêu cầu tối giản.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập ghi chú...",
  disabled = false,
  className,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Tắt các mark/node không nằm trong phạm vi tối thiểu đã chọn.
        bold: false,
        italic: false,
        strike: false,
        code: false,
        codeBlock: false,
        heading: false,
        blockquote: false,
        horizontalRule: false,
        // Giữ lại: paragraph, hardBreak, bulletList, orderedList, listItem
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "min-h-[100px] px-3 py-2",
        ),
      },
    },
  });

  // Đồng bộ khi `value` từ ngoài đổi (vd: load lại data khi edit asset khác)
  // mà không phải do chính editor này gây ra.
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "w-full border border-gray-300 rounded-md shadow-sm overflow-hidden",
        "focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500",
        disabled && "bg-gray-100 cursor-not-allowed",
        className,
      )}
    >
      {/* Toolbar tối giản — chỉ 2 nút theo đúng phạm vi */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1 bg-gray-50">
        <ToolbarButton
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Danh sách dấu đầu dòng"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded hover:bg-gray-200 transition-colors",
        active && "bg-gray-300 text-primary-700",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
