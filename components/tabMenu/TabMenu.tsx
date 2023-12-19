/* eslint-disable react-hooks/exhaustive-deps */
import { getWidth } from "@ui-kit/utilize";
import { Children, CSSProperties, FC, MouseEvent, useEffect, useRef, useState } from "react";

interface ITabMenu {
    titles: string[];
    defaultActiveTab: number;
};

export const TabMenu: FC<ITabMenu> = ({ titles, defaultActiveTab, children }) => {
    const dynamicRefElement = useRef<HTMLDivElement>(null);
    const firstTabMenuItem = useRef<HTMLSpanElement>(null);
    const childrenInArray = Children.toArray(children);
    const [activeTab, setActiveTab] = useState<number>(defaultActiveTab)
    const [dynamicInitializeLineStyle, setDynamicInitializeLineStyle] = useState<CSSProperties>({
        transition: '0.25s ease',
        position: 'absolute',
        content: '',
        bottom: '0px',
        height: '5px',
        width: '0px',
        background: '#00a693'
    })
    const widthTimer = useRef<NodeJS.Timeout>();
    const [width, SetWidth] = useState<number>(getWidth());

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return (() => window.removeEventListener("resize", onResize))
    }, [])

    useEffect(() => {
        if (firstTabMenuItem.current && activeTab) {
            const targetElement = firstTabMenuItem.current as HTMLSpanElement;
            const left = targetElement.offsetLeft;
            const width = targetElement.offsetWidth;
            setDynamicInitializeLineStyle(previewState => {
                return {
                    ...previewState,
                    width: width,
                    left: left
                }
            })
        }
    }, [titles, width]);

    const onResize = () => {
        clearTimeout(widthTimer.current as NodeJS.Timeout);
        widthTimer.current = setTimeout(() => {
            SetWidth(getWidth());
        }, 200);
    }
    
    const changeRegionDynamicLineAndId = (event: MouseEvent<HTMLSpanElement>, index: number): void => {
        const targetElement = event.target as HTMLSpanElement;
        const left = targetElement.offsetLeft;
        const width = targetElement.offsetWidth;
        setDynamicInitializeLineStyle(previewState => {
            return {
                ...previewState,
                width: width,
                left: left
            }
        })
        setActiveTab(index)
    }

    return (
        <main className="tab-menu-container">
            <nav className='tab-menu-nav-container' style={{ position: 'relative' }}>
                <article className='nav-article container'>
                    {
                        titles.map((item, index) =>
                            <span
                                key={`title-span-${index}`}
                                className='sub-tab-menu'
                                ref={index + 1 === defaultActiveTab ? firstTabMenuItem : null}
                                style={{ cursor: 'pointer' }}
                                onClick={(event) => changeRegionDynamicLineAndId(event, index + 1)}
                            >
                                {item}
                            </span>
                        )
                    }
                </article>
                <div className='dynamic-line' style={dynamicInitializeLineStyle} ref={dynamicRefElement} />
            </nav>
            <article className="tab-menu-article">
                {activeTab ? childrenInArray[activeTab - 1] : ''}
            </article>
        </main>
    )
}