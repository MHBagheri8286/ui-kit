/* eslint-disable react-hooks/exhaustive-deps */
import PopperJS from '@popperjs/core';
import { Manager } from '@ui-kit/components/index';
import { FC, ReactNode, useRef, useState } from "react";

interface IPopoverProps {
    id?: string;
    closeEventId: string;
    disable?: boolean;
    content: ReactNode | string;
    placement: PopperJS.Placement;
    className?: string;
    handlePopover?: (value: boolean) => void;
}

export const Popover: FC<IPopoverProps> = ({ id, closeEventId, disable, content, placement, className, children, handlePopover }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [popoverVisible, setPopoverVisible] = useState(false);

    const handleClick = (e: any) => {
        if (popoverRef.current?.contains(e.target) && closeEventId) {
            if (document.getElementById(closeEventId)?.contains(e.target))
                hidePopover();
        } else if (!document.getElementById('popperContent')?.contains(e.target))
            hidePopover();
    }

    const renderRef = (ref: string | ((instance: any) => void) | React.RefObject<any> | null | undefined) => {
        return (
            <div className="popover-trigger" ref={ref} onClick={showPopover}>
                {children}
            </div>
        );
    }

    const showPopover = () => {
        if (!popoverVisible && !disable) {
            document.addEventListener("click", handleClick);
            setPopoverVisible(true);
            if (handlePopover)
                handlePopover(true);
        }
    }

    const hidePopover = () => {
        document.removeEventListener("click", handleClick);
        setPopoverVisible(false);
        if (handlePopover)
            handlePopover(false);
    }

    return (
        <div id={id} ref={popoverRef} className={`popover${className ? ` ${className}` : ""}`}>
            <Manager
                content={content}
                placement={placement}
                visible={popoverVisible}
                renderRef={renderRef}
            />
        </div>
    )
}