import { FC, ReactNode } from "react";
import PopperJS from '@popperjs/core';
import { Manager as PopperManager, Popper, Reference } from 'react-popper';
import { CSSTransition } from 'react-transition-group';
interface IMangerProps {
    placement: PopperJS.Placement;
    visible: boolean;
    content: ReactNode | string;
    renderRef: (ref: string | ((instance: any) => void) | React.RefObject<any> | null | undefined) => JSX.Element;
}

export const Manager: FC<IMangerProps> = ({ visible, placement, content, renderRef }) => {
    return (
        <PopperManager>
            <Reference>
                {({ ref }) => renderRef(ref)}
            </Reference>
            <CSSTransition
                classNames="fade"
                in={visible}
                timeout={{ enter: 500, exit: 150 }}
                unmountOnExit
            >
                <Popper placement={placement}>
                    {
                        ({ ref, style, placement, arrowProps }) =>
                            <div
                                id="popperContent"
                                className={`popper-content p-${placement}`}
                                ref={ref}
                                style={style}
                                data-placement={placement}
                            >
                                {content}
                                <div ref={arrowProps.ref} style={arrowProps.style} />
                                <div className="arrow"></div>
                            </div>
                    }
                </Popper>
            </CSSTransition>
        </PopperManager>
    )
}