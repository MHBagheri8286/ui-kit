import { FC } from "react";
import loading from "@ui-kit/assets/images/load.svg";

interface ILoadingProps {
    showLoader?: boolean;
    absolute?: boolean
}

export const Loading: FC<ILoadingProps> = ({ showLoader, absolute = true }) => {
    return (
        <div className={`loading-bar${absolute ? ' absolute-loading-bar' : ''}${showLoader ? ' active-loading' : ''}`}>
            <img src={loading} alt="loading" />
        </div>
    )
}