import { ReactNode, useState } from 'react';
import { Resizable } from 're-resizable';

interface ResizableSidebarProps {
  children: ReactNode;
  initialWidth: number;
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right';
}

export function ResizableSidebar({
  children,
  initialWidth,
  onResize,
  minWidth = 200,
  maxWidth = 600,
  side = 'left',
}: ResizableSidebarProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);

  const handleClasses = side === 'left' 
    ? { right: 'resize-handle-left' }
    : { left: 'resize-handle-right' };

  const handleStyles = side === 'left'
    ? {
        right: {
          width: '6px',
          right: '-3px',
          cursor: 'col-resize',
          background: 'transparent',
          zIndex: 100,
        },
      }
    : {
        left: {
          width: '6px',
          left: '-3px',
          cursor: 'col-resize',
          background: 'transparent',
          zIndex: 100,
        },
      };

  const enableConfig = side === 'left'
    ? {
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }
    : {
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      };

  return (
    <Resizable
      size={{ width: initialWidth, height: 'auto' }}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(_e, _direction, _ref, d) => {
        setIsResizing(false);
        onResize(initialWidth + d.width);
      }}
      minWidth={minWidth}
      maxWidth={maxWidth}
      enable={enableConfig}
      handleStyles={handleStyles}
      handleClasses={handleClasses}
      className="hidden lg:block relative flex-shrink-0 self-start"
      style={{ overflow: 'visible' }}
    >
      <div className={`h-full w-full relative ${isResizing ? 'resizing' : ''}`}>
        {children}
        
        {/* Hover detection area for resize handle */}
        <div 
          className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 w-[6px] z-[90]`}
          style={{ 
            [side === 'left' ? 'right' : 'left']: '-3px',
          }}
          onMouseEnter={() => setIsHoveringHandle(true)}
          onMouseLeave={() => setIsHoveringHandle(false)}
        />
        
        {/* Resize handle indicator - visible only when hovering the handle or dragging */}
        <div 
          className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 transition-opacity duration-150 pointer-events-none z-[60]`}
          style={{ 
            [side === 'left' ? 'right' : 'left']: '0px',
            width: '2px',
            backgroundColor: '#10b981',
            opacity: isResizing || isHoveringHandle ? 0.4 : 0,
            boxShadow: 'none',
            filter: 'none',
          }}
        ></div>
      </div>
    </Resizable>
  );
}
