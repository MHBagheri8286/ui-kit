/* eslint-disable react-hooks/exhaustive-deps */
import { ViewPort } from '@ui-kit/common';
import { getWidth } from '@ui-kit/utilize';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { CSSTransition } from 'react-transition-group';

interface IModalProps {
    id?: string;
    dialogContentWrapperId?: string;
    className?: string;
    name?: "slide-up" | "slide-down" | "slide-right" | "slide-left" | "fade" | "default" | "none";
    show: boolean;
    style?: CSSProperties;
    mode?: "full" | "inline";
    fullContent?: boolean;
    onClose?: (event: any) => void;
}
export const Modal: FC<IModalProps> = (props) => {
    const { id, dialogContentWrapperId, children, className = "", show, mode = "full", style, name = "default", onClose } = props;
    const { goBack, push } = useHistory();
    const { search, hash } = useLocation();
    const { small } = ViewPort;
    const modalRef = useRef<HTMLDivElement>(null);
    const [fullContent, setFullContent] = useState<boolean>(false);
    const modalId = useRef((Math.random() + 1).toString(36).substring(7));
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        if (mode === "full") {
            if (show) {
                if (!window.location.href.includes(`#${modalId.current}`))
                    window.addEventListener("hashchange", handleHash);
                push(`${search}${hash}#${modalId.current}`);
                // Calculate height of modal base on content height
                setTimeout(() => {
                    const contentHeight = document.getElementById(dialogContentWrapperId as string)?.getBoundingClientRect().height
                        || document.getElementById(modalId.current)?.getBoundingClientRect().height || 0;
                    setFullContent(width <= small && contentHeight > (window.innerHeight * 0.80) ? true : false)
                }, 150)
            }
            else {
                if (window.location.href.includes(`#${modalId.current}`))
                    goBack();
                window.removeEventListener("hashchange", handleHash);
                setTimeout(() => {
                    modalRef?.current?.classList.remove("full-content")
                }, 500)
            }
            return (() => {
                window.removeEventListener("hashchange", handleHash);
                if (Array.prototype.slice.call(document.getElementsByClassName("modal-root")).find((x: HTMLElement) => x.classList.contains("visible")))
                    document.documentElement.classList.add("modal-open");
                else
                    setTimeout(() => {
                        document.documentElement.classList.remove("modal-open");
                    }, 150)
            })
        }
    }, [show]);

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const handleHash = (e: HashChangeEvent) => {
        e.preventDefault();
        if (!window.location.href.includes(`#${modalId.current}`) && show && onClose)
            onClose && onClose(e);
    }

    return (
        <div id={id} ref={modalRef} className={`modal${(show) ? ' pointer-event' : ''}${fullContent || props.fullContent ? " full-content" : ""} ${mode} ${className}`.trim()}>
            {mode === "full" ? <div className={`modal-root${(show) ? ' visible' : ''}`} onClick={(e) => onClose && onClose(e)} /> : ""}
            <div
                id={modalId.current}
                className='modal-container'
                style={width > small ? style : undefined}
            >
                <CSSTransition
                    classNames={name === "default" ? width > small ? "fade" : "slide-up" : name}
                    in={show}
                    timeout={{
                        enter: 500,
                        exit: name === "default" ? width > small ? 150 : 400
                            : name === "fade" ? 150 : 400
                    }}
                    unmountOnExit
                >
                    {children}
                </CSSTransition>
            </div>
        </div>
    )
}
