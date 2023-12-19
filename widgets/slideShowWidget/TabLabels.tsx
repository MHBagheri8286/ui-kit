/* eslint-disable react-hooks/exhaustive-deps */
import { ISlideshowWidget } from "@ui-kit/widgets/index";
import { FC, Fragment, useEffect, useRef } from "react";

interface ISlideShowWidgetProps {
  dataSource: ISlideshowWidget;
  activeItemIndex: number;
  animationNone?: boolean;
  onTabLabelBtnClick: (index: number) => void;
}

const TabLabels: FC<ISlideShowWidgetProps> = (props) => {
  const { dataSource, activeItemIndex, animationNone, onTabLabelBtnClick } = props;
  const interval = 5000;
  const tabLabelRefs = useRef<HTMLDivElement[]>([]);
  const tabLabelsItemsRef = useRef<HTMLDivElement>(null);
  const dynamicLine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dataSource.progressBar === "OutsideTab" && renderDynamicLine(activeItemIndex);
  }, [activeItemIndex])

  const renderDynamicLine = (index: number) => {
    if (dynamicLine.current && tabLabelRefs.current && tabLabelRefs.current[index]) {
      dynamicLine.current.style.width = tabLabelRefs.current[index].offsetWidth + 'px';
      dynamicLine.current.style.left = tabLabelRefs.current[index].offsetLeft + 'px';
      tabLabelsItemsRef.current?.scrollTo({ left: tabLabelRefs.current[index].offsetLeft, behavior: "smooth" });
    }
  }


  return (
    <div className="tab-labels">
      <div className="tab-labels-container">
        <div className="container">
          <div
            ref={tabLabelsItemsRef}
            className="tab-labels-items row spa-0">
            {
              dataSource.slides?.contentItems.map((slide, index) =>
                <div
                  key={index}
                  ref={ref => tabLabelRefs.current[index] = ref as HTMLDivElement}
                  onClick={() => onTabLabelBtnClick(index)}
                  className={`${dataSource.progressBar === "InsideTab" ? `col-1-${dataSource.slides?.contentItems.length} col-md-1-1 col-sm-1-1` : "col-1-auto"} tab-labels-item flex flex-center column-direction${index === activeItemIndex ? " active" : ""}`}
                >
                  <h3 className="title">{slide.displayText}</h3>
                  {
                    dataSource.progressBar === "InsideTab" &&
                    <Fragment>
                      <div className="gray-line flex-grow" />
                      <div
                        className={`green-line flex-grow${animationNone ? " animation-none" : ""}`}
                        style={{ animationName: dataSource.autoDisplay && index === activeItemIndex ? "width" : "", animationDuration: index === activeItemIndex ? `${interval}ms` : "" }}
                      />
                    </Fragment>
                  }
                </div>
              )
            }
            {
              dataSource.progressBar === "OutsideTab" &&
              <div className="dynamic-Line" ref={dynamicLine}></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabLabels;
