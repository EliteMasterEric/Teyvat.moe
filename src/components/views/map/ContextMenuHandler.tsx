import { FunctionComponent, PropsWithChildren, useCallback } from 'react';
import { Empty } from 'src/components/Types';

type ContextMenuHandlerBaseProps = Empty;
type ContextMenuHandlerProps = PropsWithChildren<ContextMenuHandlerBaseProps>;

/**
 * This component
 * @param children The nodes to display which are affected by this custom context menu.
 * @returns
 */
const ContextMenuHandler: FunctionComponent<ContextMenuHandlerProps> = ({ children }) => {
  const onContextMenu = useCallback((_event) => {
    console.debug('Opened context menu.');
  }, []);

  return (
    <div onContextMenu={onContextMenu}>
      {/*  */}
      {children}
    </div>
  );
};

export default ContextMenuHandler;
