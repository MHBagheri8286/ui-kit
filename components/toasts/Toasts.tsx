
import { IMessage, ViewPort } from "@ui-kit/common";
import { ToastMessage } from "@ui-kit/components/index";
import { getWidth } from "@ui-kit/utilize";
import { FC, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface IToastsprops {
    dataSource: IMessage[];
    onRemove: (toasts: IMessage[]) => void;
}

export const Toasts: FC<IToastsprops> = (props) => {
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }

    const removeToast = (code: string) => {
        props.dataSource.splice(props.dataSource.findIndex(t => t.code === code), 1);
        props.onRemove(props.dataSource);
    }

    return (
        <TransitionGroup className="toasts">
            {
                props.dataSource.map((t, index) =>
                    <CSSTransition
                        key={index}
                        classNames={width > ViewPort.small ? "toasts-slide-side" : "toasts-slide-up"}
                        timeout={500}
                    >
                        <ToastMessage
                            key={index}
                            toast={t}
                            removeToast={removeToast}
                        />
                    </CSSTransition>
                )
            }
        </TransitionGroup>
    );
}