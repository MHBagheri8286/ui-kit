/* eslint-disable react-hooks/exhaustive-deps */
import { convertingNodesToArray, setKeyCamelCaseToDiffCase, walkingOnElementChildren } from "@ui-kit/utilize";
import { CSSProperties, useEffect, useRef } from "react";

interface ISearchHighlightProps {
    searchValue?: string;
    classNameForHighlightElement?: string;
    styleForHighlightElement?: CSSProperties;
}

export const SearchHighlight: React.FC<ISearchHighlightProps> = ({ searchValue, classNameForHighlightElement, styleForHighlightElement, children }) => {

    const searchRegion = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const highlightNodes = walkingOnElementChildren(searchRegion.current!).filter(node =>
            node?.nodeName === "#text" && !(Array.from(node.textContent!).every(x => x === " ")));
        setHighlightedElement(highlightNodes, searchValue!);
        highlightedSearchingValue(walkingOnElementChildren(searchRegion.current!).filter(node => node?.nodeName === "#text"));
    }, [searchRegion.current, searchValue])

    const setHighlightedElement = (texts: ChildNode[], searchValue: string): void => {
        const searchHighLightId = "searchHighLight";
        texts?.forEach(node => {
            const parent = node?.parentElement;
            const notValidParent = parent?.id.includes(searchHighLightId);
            const mainParent = parent?.parentElement;
            let text = node?.textContent;
            if (notValidParent) {
                if (mainParent?.children) {
                    const initialInnerDom = convertingNodesToArray(mainParent?.childNodes!).map(node => node?.nodeName !== "#text" ?
                        (node as Element)?.id.includes(searchHighLightId) ? (node as Element)?.innerHTML : (node as Element)?.outerHTML : node.textContent);
                    if (mainParent?.innerHTML) mainParent.innerHTML = initialInnerDom.join("");
                    if (mainParent?.textContent) text = mainParent?.textContent;
                }
            }
            let nextElement = node.nextSibling;
            let lastElement = node.previousSibling;
            let innerHTML = [text?.replace(new RegExp(searchValue, "g"), `<span id=${searchHighLightId}>${searchValue}</span>`)];
            while (nextElement) {
                innerHTML.push((nextElement as Element)?.outerHTML ?? nextElement?.textContent);
                nextElement = nextElement.nextSibling;
            };
            while (lastElement) {
                innerHTML.unshift((lastElement as Element)?.outerHTML ?? lastElement?.textContent);
                lastElement = lastElement.previousSibling;
            };
            if (notValidParent) mainParent?.innerHTML && (mainParent.innerHTML = innerHTML.join(""));
            else if (parent?.innerHTML && (text?.includes(searchValue))) parent.innerHTML = innerHTML.join("");
        })
    }

    const highlightedSearchingValue = (texts: ChildNode[]): void => {
        texts?.forEach(node => {
            const defaultClassNameForHighlightElement = "high-light-search";
            const searchHighLightId = "searchHighLight";
            Object.keys(styleForHighlightElement!)?.forEach(key => ((parent as HTMLElement)?.style?.setProperty(setKeyCamelCaseToDiffCase(key, "kebabCase"), "unset")))
            const parent = node?.parentElement;
            if (parent?.id?.includes(searchHighLightId)) {
                parent?.setAttribute("class", `${defaultClassNameForHighlightElement} ${classNameForHighlightElement ? classNameForHighlightElement : ''}`);
                Object.keys(styleForHighlightElement!)?.forEach(key => ((parent as HTMLElement)?.style?.setProperty(setKeyCamelCaseToDiffCase(key, "kebabCase"), (styleForHighlightElement![key as keyof CSSProperties] as string))))
            }
            !searchValue && Object.keys(styleForHighlightElement!)?.forEach(key => ((parent as HTMLElement)?.style?.setProperty(setKeyCamelCaseToDiffCase(key, "kebabCase"), "unset")));
        })
    }

    return <div className="search-region" ref={searchRegion}>
        {children}
    </div>
}
