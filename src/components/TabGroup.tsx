import {
  Dispatch, SetStateAction, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { StyledButton } from './StyledButton';

export type TabProps = { className?: string, title: string, activateByTitle: Dispatch<SetStateAction<string>> };
type Tab = (props: TabProps) => JSX.Element;
type Props = HeaderStyleProps & CurrentTabStyleProps & { children: { [title: string]: Tab }, className?: string, };
type HeaderStyleProps = { tabHeaderContainerClassName?: string, activeTabHeaderClassName?: string };
type CurrentTabStyleProps = { tabClassName?: string, tabHeaderClassName?: string };

export function TabGroup({
  children,
  className: containerClassName,
  tabClassName,
  tabHeaderClassName,
  activeTabHeaderClassName,
  tabHeaderContainerClassName,
}: Props) {
  const [activeTitle, activateByTitle] = useState(Object.keys(children)[0] ?? '');

  const currentTab = useMemo(() => {
    const tabClasses = classNames({
      tabClassName,
      grow: true,
    });
    const Child = children[activeTitle];
    return (
      <>
        {Child !== undefined && <Child title={activeTitle} activateByTitle={activateByTitle} className={tabClasses} />}
      </>
    );
  }, [activeTitle, children, tabClassName]);

  const containerClasses = classNames({
    containerClassName,
    'm-2 flex flex-col': true,
  });

  const headerContainerClasses = classNames({
    tabHeaderClassName,
    'flex flex-wrap mb-2': true,
  });

  return (
    <div className={containerClasses}>
      <div className={headerContainerClasses}>
        {
          Object.keys(children)
            .map((title) => (
              <TabHeader
                key={title}
                activateByTitle={activateByTitle}
                title={title}
                isActive={title === activeTitle}
                tabHeaderContainerClassName={tabHeaderContainerClassName}
                activeTabHeaderClassName={activeTabHeaderClassName}
              />
            ))
        }
      </div>
      {currentTab}
    </div>
  );
}

type TabHeaderProps = HeaderStyleProps & { title: string, isActive: boolean, activateByTitle: Dispatch<SetStateAction<string>> };

function TabHeader({
  title,
  tabHeaderContainerClassName,
  activeTabHeaderClassName,
  isActive,
  activateByTitle,
}: TabHeaderProps) {
  const tabStyle = classNames({
    tabHeaderContainerClassName,
    activeTabHeaderClassName: activeTabHeaderClassName && isActive,
  });
  return (
    <StyledButton className={tabStyle} onClick={() => activateByTitle(title)}>
      {title}
    </StyledButton>
  );
}
