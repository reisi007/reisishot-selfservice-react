import React, {
  Context, createContext, Dispatch, SetStateAction, useContext, useMemo, useState,
} from 'react';

export type PageableContextState<T extends object> = { idx: number, name: keyof T, isFirst: boolean, isLast: boolean };

export type PageableContextStateType<T extends object> = [PageableContextState<T>, Dispatch<SetStateAction<number>>];

function usePageableContextState<T extends object>(initial: keyof T, order: Array<keyof T>): PageableContextStateType<T> {
  const [idx, setCurentPage] = useState<number>(order.indexOf(initial) ?? 0);
  const state = useMemo((): PageableContextState<T> => {
    const name = order[idx];
    return {
      idx,
      name,
      isFirst: idx === 0,
      isLast: idx === order.length - 1,
    };
  }, [idx, order]);
  return [state, setCurentPage];
}

export function Pageable<T extends object>({
  children,
  initialPage,
  order,
}: { children: (context: Context<PageableContextStateType<T>>) => JSX.Element, initialPage?: keyof T, order: Array<keyof T> }) {
  const [state, setState] = usePageableContextState<T>(initialPage ?? Object.keys(order)[0] as keyof T, order);

  const contextState: PageableContextStateType<T> = useMemo(() => [state, setState], [setState, state]);

  const CurContext = createContext<PageableContextStateType<T>>(contextState);

  return (
    <CurContext.Provider value={contextState}>
      <div className="p-2 rounded-xl border">
        {children(CurContext)}
      </div>
    </CurContext.Provider>
  );
}

type PageProps<T extends object> = {
  name: keyof T,
  children: (props: PageableContextStateType<T>) => JSX.Element,
  context: Context<PageableContextStateType<T>>
};

export function Page<T extends object>({
  name,
  children,
  context,
}: PageProps<T>) {
  const rawState = useContext(context);
  const [{ name: curName }] = rawState;

  return (
    <>
      {name === curName && children(rawState)}
    </>
  );
}
