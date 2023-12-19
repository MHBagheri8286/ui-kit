import { FC, useState } from "react";
import { generateIcon, IIconSetting } from "@ui-kit/components/index";
import { generateText } from "@ui-kit/utilize";

export interface ITabPanelItems {
    title: string;
    content: any;
    icon?: string;
}

interface ITabPanelProps {
    dataSource: Array<ITabPanelItems>;
    selectedIndex?: number;
    itemDisplayFormat?: string,
    iconSetting?: IIconSetting,
    renderHeaderTabItem?: (record: any, index?: number) => JSX.Element;
}

export const TabPanel: FC<ITabPanelProps> = ({ dataSource, selectedIndex = 0, itemDisplayFormat = "title", iconSetting, renderHeaderTabItem }) => {
    const [currentTab, setCurrentTab] = useState<number>(selectedIndex);

    return (
        <div className="tab-panel">
            <ul className="tab-navs flex flex-center">
                {
                    dataSource.map((tabItem, index) =>
                        <li
                            key={index}
                            className={`tab-navs-items${currentTab === index ? " active-tab" : ""}`}
                            onClick={() => setCurrentTab(index)}
                        >
                            {
                                renderHeaderTabItem ? renderHeaderTabItem(tabItem, index) :
                                    <div className="flex flex-center justify-center">
                                        {generateIcon(iconSetting, tabItem)}
                                        <div className="title">{generateText(tabItem, itemDisplayFormat)}</div>
                                    </div>
                            }
                        </li>
                    )
                }
            </ul>
            {
                dataSource[currentTab].content ? <div className="tab-content">{dataSource[currentTab].content}</div> : ""
            }
        </div>
    )
}
