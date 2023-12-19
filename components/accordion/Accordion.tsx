import { Icon } from "@ui-kit/components/index";
import { FC, useEffect, useState } from "react";
interface IAccordionProps {
    title?: string;
    expand?: boolean;
}

export const Accordion: FC<IAccordionProps> = ({ title, children, expand }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => setVisible(expand!), [expand, title])

    return (
        <div className={`accordion ${visible ? "accordion-visible" : ""}`}>
            <div className="accordion-header" onClick={() => setVisible(!visible)}>
                <span>{title}</span>
                <Icon name="icon-chevron-down" className="accordion-icon" />
            </div>
            <div className="accordion-content">
                {children}
            </div>
        </div >
    )
}