import DOMPurify from "dompurify";
import { useMemo } from "react";

/**
 * RichTextDisplay — hiển thị nội dung HTML đã lưu (từ RichTextEditor) một
 * cách AN TOÀN. Luôn sanitize qua DOMPurify trước khi render, kể cả khi
 * nội dung đã được BE sanitize trước đó (defense in depth — phòng trường
 * hợp dữ liệu cũ trong DB chưa qua sanitize, hoặc BE bị bypass).
 *
 * CHỈ cho phép đúng các thẻ nằm trong phạm vi RichTextEditor hỗ trợ:
 * p, br, ul, ol, li. Mọi thẻ/attribute khác (script, style, onClick,
 * iframe, img...) đều bị loại bỏ.
 */
const ALLOWED_TAGS = ["p", "br", "ul", "ol", "li"];
const ALLOWED_ATTR = []; // không cho phép bất kỳ attribute nào (class, style, href...)

export function RichTextDisplay({ html, emptyText = "—", className }) {
  const clean = useMemo(() => {
    if (!html || !html.trim()) return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    });
  }, [html]);

  if (!clean) {
    return <p className={className}>{emptyText}</p>;
  }

  return (
    <div
      className={`rich-text-content text-sm text-foreground ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
