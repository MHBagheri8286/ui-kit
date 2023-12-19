import { IHeaderSetting } from "@ui-kit/widgets/models";
import { FC } from "react";

interface ITitleProps {
    text: string;
    dataSource?: IHeaderSetting;
    border?: 'start' | 'center' | 'end' | 'none';
    size?: 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
    className?: string;
}

export const Title: FC<ITitleProps> = ({ text, border = 'start', size = 'h1', className }) => {
    switch (size) {
        case 'h1':
            return <h1 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h1>;
        case 'h2':
            return <h2 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h2>;
        case 'h3':
            return <h3 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h3>;
        case 'h4':
            return <h4 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h4>;
        case 'h5':
            return <h5 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h5>;
        case 'h6':
            return <h6 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h6>;
        default:
            return <h1 className={`title content-title border-${border}${className ? ` ${className}` : ''}`}>{text}</h1>;
    }
}