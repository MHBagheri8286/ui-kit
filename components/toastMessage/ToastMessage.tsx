/* eslint-disable react-hooks/exhaustive-deps */
import { IMessage, MessageType } from "@ui-kit/common";
import { Translate } from "@ui-kit/service";
import { FC, useEffect, useRef } from "react";

interface IToastMessageProps {
    toast: IMessage;
    removeToast: (code: string) => void;
}

export const ToastMessage: FC<IToastMessageProps> = ({ toast, removeToast }) => {
    const { tr } = Translate;
    const toastRef = useRef<HTMLDivElement>(null);
    const delay = 5000;

    useEffect(() => {
        if (toastRef.current) {
            setTimeout(() => toastRef.current?.classList.add("active"), 100);
            setTimeout(() => removeToast(toast.code), delay);
        }
    }, [toastRef]);

    const getToast = () => {
        let className = "info";
        let name = "icon-check";
        let txt = tr("message");
        switch (toast.type) {
            case MessageType.Warning:
                className = "warn";
                name = "icon-alert-circle-outline";
                txt = tr("error");
                break;
            case MessageType.Error:
                className = "error";
                name = "icon-information-outline";
                txt = tr("error");
                break;
            case MessageType.Success:
                className = "success";
                name = "icon-check";
                txt = tr("message");
                break;
        }

        return (
            <div ref={toastRef} className={`toast-message type-${className}`}>
                <div className="flex content">
                    <i className={`icon ${name}`}></i>
                    <div className="toast-desc">
                        <span className="toast-desc-title">{txt}</span>
                        <span>{toast.text}</span>
                    </div>
                </div>
                <div className="border-bottom" />
            </div>
        );
    }

    return getToast();
}