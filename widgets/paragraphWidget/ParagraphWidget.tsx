import { htmlSanitizer } from "@ui-kit/utilize";
import { IParagraphWidget } from "@ui-kit/widgets/models";
import { FC } from "react";

interface IParagraphWidgetProps {
    dataSource: IParagraphWidget;
}

export const ParagraphWidget: FC<IParagraphWidgetProps> = ({ dataSource }) => {
    const htmlBody = htmlSanitizer(dataSource.text?.html || "");

    return (
        <div className="paragraph-widget">
            <div className="paragraph-widget-content" dangerouslySetInnerHTML={{ __html: htmlBody }} />
        </div>
    )
}