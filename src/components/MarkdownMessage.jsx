/**
 * MarkdownMessage — isolated so react-markdown + remark-gfm
 * land in their own lazy chunk (code-split via React.lazy in AIChatPanel).
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const COMPONENTS = {
  table: (props) => (
    <div className="ai-md-table-wrap">
      <table className="ai-md-table" {...props} />
    </div>
  ),
  code: ({ inline, className, children, ...props }) =>
    inline ? (
      <code className="ai-ic" {...props}>{children}</code>
    ) : (
      <pre className="ai-code"><code className={className} {...props}>{children}</code></pre>
    ),
  a: (props) => <a target="_blank" rel="noreferrer noopener" {...props} />,
};

const PLUGINS = [remarkGfm];

export default function MarkdownMessage({ children }) {
  return (
    <ReactMarkdown remarkPlugins={PLUGINS} components={COMPONENTS}>
      {children || ''}
    </ReactMarkdown>
  );
}
