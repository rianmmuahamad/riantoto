// Simple markdown renderer for basic formatting
export const renderMarkdown = (text) => {
  if (!text) return text;
  
  // Convert **bold** to <strong>bold</strong>
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>italic</em>
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert ***bold italic*** to <strong><em>bold italic</em></strong>
  rendered = rendered.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  
  return rendered;
};

// Component to render markdown text
export const MarkdownText = ({ children, className = "" }) => {
  const renderedText = renderMarkdown(children);
  
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: renderedText }}
    />
  );
};

