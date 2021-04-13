import { useRef, useEffect, FunctionComponent, MouseEventHandler, PropsWithChildren } from 'react';

type ContextMenuHandlerBaseProps = {};
type ContextMenuHandlerProps = PropsWithChildren<ContextMenuHandlerBaseProps>;

/**
 * This component
 * @param children The nodes to display which are affected by this custom context menu.
 * @returns
 */
const ContextMenuHandler: FunctionComponent<ContextMenuHandlerProps> = ({ children }) => {
  const onContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {};

  return (
    <div onContextMenu={onContextMenu}>
      {/*  */}
      {children}
    </div>
  );
};

export default ContextMenuHandler;
