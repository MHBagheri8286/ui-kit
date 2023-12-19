import { Icon } from "@ui-kit/components/index";
import { Translate } from "@ui-kit/service";
import { FC, useEffect } from "react";

enum PreloaderType { Text = 1, Linear, Circular, Progress }

export enum LoaderMode {
    Blur,
    Solid
}

interface IPreloaderProps {
    type?: PreloaderType;
    title?: string;
    message?: string;
    mode?: LoaderMode;
}

export const Preloader: FC<IPreloaderProps> = ({ type, title, message, mode = LoaderMode.Blur }) => {
    const { tr } = Translate;

    useEffect(() => {
        document.documentElement.classList.add("overflow-hidden");

        return () => {
            document.documentElement.classList.remove("overflow-hidden");
        }
    }, [])

    const getPreloader = () => {
        switch (type) {
            case PreloaderType.Text:
                return (
                    <div className="pl-text"></div>
                )
            default:
                return (
                    <div className="pl-circular">
                        <div className="pl-circular-border">
                            <div className="pl-circular-gap" />
                            <Icon name="icon-airplane" />
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="preloader" >
            <div className={`pl-root${mode === LoaderMode.Solid ? ' solid' : ' blur'}`} />
            <div className="pl-container">
                <div className="pl-wrapper" />
                {getPreloader()}
                <div className="pl-text">
                    <h3 className="pl-title">{title || tr("msg_operation_in_progress")}</h3>
                    <p className="pl-message">{message || tr("msg_wait")}</p>
                </div>
            </div>
        </div>
    )
}
