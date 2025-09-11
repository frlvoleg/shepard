import { useState, Children } from 'react';
import { TabPaneProps, TabsProps } from '../types';

export function TabPane(props: TabPaneProps) {
  return <>{props.children}</>;
}

function Tabs({ children }: TabsProps) {
  const [selected, setSelected] = useState(0);

  const handleSelect = (idx: number) => setSelected(idx);

  if (!children) return null;

  return (
    <div>
      <div className="flex flex-row w-full border-0 border-b border-solid border-gray-300">
        {Children.map(children, (child: any, idx: any) => {
          if ((child as any)?.type !== TabPane) return null;
          return (
            <button
              type="button"
              className={`w-max py-1 px-4 mx-4 cursor-pointer text-lg font-medium bg-white transform translate-y-px border-0 ${
                selected === idx
                  ? 'border-b-2 border-solid border-primary text-primary'
                  : ''
              }`}
              data-selected={selected === idx}
              onClick={() => {
                if ((child as any)?.props?.onClick) (child as any).props.onClick();
                handleSelect(idx);
              }}
            >
              {(child as any)?.props?.label}
            </button>
          );
        })}
      </div>
      <div className="p-3">
        {Children.map(children, (child: any, idx: any) => {
          if ((child as any)?.type !== TabPane) return null;
          if (selected !== idx) return null;
          return child;
        })}
      </div>
    </div>
  );
}

Tabs.TabPane = TabPane;

export default Tabs;
