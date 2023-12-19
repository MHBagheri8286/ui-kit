/* eslint-disable react-hooks/exhaustive-deps */
import { ViewPort } from "@ui-kit/common";
import { Button, Modal } from "@ui-kit/components/index";
import { getWidth } from "@ui-kit/utilize";
import { CSSProperties, Children, EventHandler, FC, useEffect, useRef, useState } from "react";

export interface IDialogProps {
    id?: string;
    className?: string;
    show: boolean;
    title?: string;
    showCloseButton?: boolean;
    onHiding?: EventHandler<any>;
    animate?: "slide-up" | "slide-down" | "fade" | "default" | "none";
    processMode?: boolean;
    style?: CSSProperties;
    fullContent?: boolean;
}

export const Dialog: FC<IDialogProps> = ({ onHiding, show, style, fullContent, title, processMode, showCloseButton = true, className, id, animate = "default", children }) => {
    const { small } = ViewPort;
    const footerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const dialogContentWrapperId = useRef((Math.random() + 1).toString(36).substring(7));
    const [contentAndHeaderHeigh, setContentAndHeaderHeight] = useState<number>(0);
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());
    const closeBtn = processMode ? ""
        : <Button
            className="icon-close-btn"
            icon="icon-close"
            width="28px"
            height="28px"
            rounded
            onClick={onHiding}
        />;

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        if (footerRef.current && headerRef.current)
            setContentAndHeaderHeight(footerRef.current.getBoundingClientRect().height + headerRef.current?.getBoundingClientRect().height!);
    }, [show])

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    return (
        <Modal
            id={id}
            dialogContentWrapperId={dialogContentWrapperId.current}
            show={show}
            name={animate}
            fullContent={fullContent}
            className={className ?? ""}
            onClose={onHiding}
        >
            <div className="dialog" style={width > small ? style : undefined}>
                <div ref={headerRef} className="dialog-header-wrapper">
                    {title ? <div className="title trim">{title}</div> : ""}
                    {Children.toArray(children).find((child: any) => child.type?.displayName === "DialogHeader")}
                    {showCloseButton ? closeBtn : ""}
                </div>
                <div
                    id={dialogContentWrapperId.current}
                    style={{ height: contentAndHeaderHeigh ? `calc(100% - ${contentAndHeaderHeigh}px)` : "" }}
                    className="dialog-content-wrapper"
                >
                    {Children.toArray(children).filter((child: any) => child?.type?.displayName !== "DialogHeader" && child?.type?.displayName !== "DialogFooter")}
                </div>
                {
                    Children.toArray(children).filter((child: any) => child?.type?.displayName === "DialogFooter").length ?
                        <div ref={footerRef} className="dialog-footer-wrapper">
                            {Children.toArray(children).filter((child: any) => child?.type?.displayName === "DialogFooter")}
                        </div>
                        : ""
                }
            </div>
        </Modal>
    )
}


