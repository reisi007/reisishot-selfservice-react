import { UseProps, useTabGroup } from './TabGroup';
import { LoginData } from '../utils/LoginData';

export function useDefaultTabGroup({
  tabs,
  loginData,
}: { loginData: LoginData, tabs: UseProps<LoginData>['tabs'] }) {
  return useTabGroup(
    {
      containerClassName: 'border border-t-0 border-gray-200 rounded-lg',
      headerContainerClassName: 'py-2 bg-reisishot/80 justify-center items-center rounded-t-lg',
      tabHeaderClassName: 'mx-2 py-1 text-white border-white',
      activeTabHeaderClassName: 'font-medium text-white border-black underline underline-offset-4',
      tabContainerClassName: 'mb-2 p-2 min-h-[30vh]',
      data: loginData,
      tabs,
    },
  );
}
