import { lazy, Suspense, useMemo } from 'react';
import { LoadingIndicator } from '../../LoadingIndicator';
import { MarkdownProps } from './MarkdownProps';

export default function Markdown(props: MarkdownProps) {
  const { content } = props;
  const LazyMarkdown = useMemo(() => lazy(() => import('./InternalMarkdown')), []);
  return <>{!!content && <Suspense fallback={<LoadingIndicator />}><LazyMarkdown {...props} /></Suspense>}</>;
}
