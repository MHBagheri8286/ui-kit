
import { Button } from "@ui-kit/components/index";
import { IFileWidget } from "@ui-kit/widgets/models";
import { FC } from "react";
import { getFilePath } from "../utilize";

interface IFileWidgetProps {
    dataSource: IFileWidget;
    contentMediaPath: string;
}

export const FileWidget: FC<IFileWidgetProps> = (props) => {
    const { contentMediaPath, dataSource } = props;
    return (
        <section className="file-widget">
            {dataSource.files?.paths.map((path, index) =>
                <Button
                    key={index}
                    className="btn-download"
                    icon="icon-download"
                    text={
                        <span className="text">{dataSource.files?.texts[index]}&nbsp;</span>
                    }
                    url={getFilePath(contentMediaPath, path)}
                    color="primary"
                    variant="outlined"
                    height="35px"
                    target="_blank"
                />)}
        </section >
    )
}