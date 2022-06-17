import {
  Dispatch, SetStateAction, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { StyledButton } from './StyledButton';

export type TabProps<AdditionalParam> = { title: string, activateByTitle: Dispatch<SetStateAction<string>>, data: AdditionalParam };
type Tab<AdditionalParam> = (props: TabProps<AdditionalParam>) => JSX.Element;

type Props<AdditionalParam> = UseProps<AdditionalParam> & { activeTitle: string, activateByTitle: Dispatch<SetStateAction<string>> };
export type UseProps<AdditionalParam> = ContainerStyleProps & CurrentTabStyleProps & { tabs: { [title: string]: Tab<AdditionalParam> }, data: AdditionalParam };

type ContainerStyleProps = { headerContainerClassName?: string, tabContainerClassName?: string, containerClassName?: string };
type CurrentTabStyleProps = { tabHeaderClassName?: string, activeTabHeaderClassName?: string };

export function useTabGroup<AdditionalParam>(props: UseProps<AdditionalParam>): [JSX.Element, Dispatch<SetStateAction<string>>] {
  const { tabs } = props;
  const [activeTitle, activateByTitle] = useState(Object.keys(tabs)[0] ?? '');
  const tabGroup = <TabGroup {...props} activateByTitle={activateByTitle} activeTitle={activeTitle} />;
  return [tabGroup, activateByTitle];
}

function TabGroup<AdditionalParam>({
  data,
  tabs,
  activeTitle,
  activateByTitle,
  containerClassName,
  tabHeaderClassName,
  activeTabHeaderClassName,
  headerContainerClassName,
  tabContainerClassName,
}: Props<AdditionalParam>) {
  const currentTab = useMemo(() => {
    const Child = tabs[activeTitle];
    return (
      <>
        {Child !== undefined && <Child data={data} title={activeTitle} activateByTitle={activateByTitle} />}
      </>
    );
  }, [tabs, activeTitle, data, activateByTitle]);

  const containerClasses = classNames(
    containerClassName,
    'w-full flex flex-col',
  );

  const headerContainerClasses = classNames(
    headerContainerClassName,
    'flex flex-wrap mb-2',
  );

  return (
    <div className={containerClasses}>
      <div className={headerContainerClasses}>
        {
          Object.keys(tabs)
            .map((title) => (
              <TabHeader
                key={title}
                activateByTitle={activateByTitle}
                title={title}
                isActive={title === activeTitle}
                tabHeaderClassName={tabHeaderClassName}
                activeTabHeaderClassName={activeTabHeaderClassName}
              />
            ))
        }
      </div>
      <div className={classNames(tabContainerClassName)}>
        {currentTab}
      </div>
    </div>
  );
}

type TabHeaderProps = CurrentTabStyleProps & { title: string, isActive: boolean, activateByTitle: Dispatch<SetStateAction<string>> };

function TabHeader({
  title,
  activeTabHeaderClassName,
  tabHeaderClassName,
  isActive,
  activateByTitle,
}: TabHeaderProps) {
  const classes = classNames(
    { [activeTabHeaderClassName ?? '']: activeTabHeaderClassName && isActive },
    tabHeaderClassName,
  );
  return (isActive
    ? <p className={classes}>{title}</p>
    : (
      <StyledButton className={classes} onClick={() => activateByTitle(title)}>
        {title}
      </StyledButton>
    )
  );
}
