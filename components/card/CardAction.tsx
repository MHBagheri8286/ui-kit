import  { FC } from "react";

interface ICardActionProps { }

export const CardAction: FC<ICardActionProps> = ({ children }) => {
    return (
        <div className="card-action">
            <div className="card-action-container flex-grow">
                {children}
            </div>
        </div>
    )
}

CardAction.displayName = "CardAction";