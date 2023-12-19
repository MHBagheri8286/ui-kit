import { IExtLocation } from "@ui-kit/common";
import { Button, IButton } from "@ui-kit/components/index";
import { isAndroidPlatform } from "@ui-kit/utilize";
import { FC } from "react";

interface INavigation extends IButton {
    location: IExtLocation;
}

export const Navigation: FC<INavigation> = (props) => {
    return <Button
        height={props.height}
        variant={props.variant ?? undefined}
        rounded={props.rounded}
        color={props.color}
        icon={props.icon ?? "icon-turn-left"}
        target={props.target ?? "_blank"}
        text={props.text}
        url={isAndroidPlatform() ?
            `geo:?q=${props.location.lat},${props.location.lng}`
            :
            `http://maps.google.com/maps?daddr=${props.location.lat},${props.location.lng}`
        }
    />
}

