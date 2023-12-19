import PopperJS from '@popperjs/core';
import { Manager } from '@ui-kit/components/index';
import { FC, useState } from "react";

interface ITooltipProps {
    id?: string;
    className?: string;
    title: string;
    placement: PopperJS.Placement;
}

export const Tooltip: FC<ITooltipProps> = ({ id, className, children, placement, title }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const renderRef = (ref: string | ((instance: any) => void) | React.RefObject<any> | null | undefined) => {
        return (
            <div
                className="tooltip-trigger"
                ref={ref}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
            >
                {children}
            </div>
        );
    }

    return (
        <div id={id} className={`tooltip${className ? ` ${className}` : ""}`}>
            <Manager
                content={title}
                placement={placement}
                visible={tooltipVisible}
                renderRef={renderRef}
            />
        </div>
    )
}