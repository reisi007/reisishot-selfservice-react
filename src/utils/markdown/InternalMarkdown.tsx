import { useMemo } from 'react';
import md from 'markdown-it';
import { MarkdownProps } from './MarkdownProps';
import './styles.css';

function InternalMarkdown(rawProps: MarkdownProps) {
  const {
    content,
    ...props
  } = rawProps;
  const markdownIt = useMemo(() => md(), []);
  const html = useMemo(() => markdownIt.render(content), [content, markdownIt]);
  // eslint-disable-next-line react/no-danger
  return <div {...props} data-markdown="" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default InternalMarkdown;
