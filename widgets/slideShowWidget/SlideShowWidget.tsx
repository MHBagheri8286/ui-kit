/* eslint-disable react-hooks/exhaustive-deps */
import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import { SlideShowItems } from "./index";
import { ISlideshowWidget } from "@ui-kit/widgets/models";

interface ISlideShowWidgetProps {
  contentMediaPath: string;
  dataSource: ISlideshowWidget;
  style?: CSSProperties;
  className?: string;
}

export const SlideShowWidget: FC<ISlideShowWidgetProps> = (props) => {
  const { contentMediaPath, dataSource, className } = props;
  const interval = 5000;
  const touchStart = useRef(0);
  const currentIndex = useRef(0);
  const slideShowWidgetRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(-1);
  const sliderTimer = useRef<null | NodeJS.Timeout>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1);
  const [animationNone, setAnimationNone] = useState<boolean>(false);

  useEffect(() => {
    if (dataSource.autoDisplay && slideShowWidgetRef.current) {
      if (slideShowWidgetRef.current.getBoundingClientRect().top < 100)
        setTimer();
      else
        document.addEventListener("scroll", scrollWindow);
    }
    return () => document.removeEventListener("scroll", scrollWindow);
  }, []);

  useEffect(() => {
    setActiveItemIndex(currentIndex.current);
  }, []);

  const scrollWindow = () => {
    if ((slideShowWidgetRef.current?.getBoundingClientRect().top || 0) - 450 < 0) {
      setTimer();
      document.removeEventListener("scroll", scrollWindow);
    }
  }

  const setTimer = () => {
    sliderTimer.current = setInterval(() => {
      prevIndex.current = currentIndex.current;
      if (currentIndex.current === (dataSource?.slides?.contentItems.length || 0) - 1) {
        currentIndex.current = 0;
        setActiveItemIndex(0);
      } else {
        setActiveItemIndex(++currentIndex.current);
      }
    }, interval);
  }

  const onTouchStart = (event: any) => {
    if (event.touches)
      touchStart.current = event.touches[0].clientX;
  }

  const onTouchEnd = (event: any) => {
    const touchEnd = (event.changedTouches && event.changedTouches[0].clientX) || 0;
    if (touchEnd - touchStart.current > 30 && (currentIndex.current !== 0 || dataSource?.autoDisplay)) {
      onPrevioeusSlideBtnClick();
    }
    else if (touchStart.current - touchEnd > 30 && (currentIndex.current !== (dataSource?.slides?.contentItems.length || 0) - 1 || dataSource?.autoDisplay)) {
      onNextSlideBtnClick();
    }
  }

  const onNextSlideBtnClick: () => void | undefined = () => {
    clearInterval(sliderTimer.current as NodeJS.Timeout);
    setAnimationNone(true);
    prevIndex.current = currentIndex.current;
    if (currentIndex.current === (dataSource?.slides?.contentItems.length || 0) - 1) {
      setActiveItemIndex(0);
      currentIndex.current = 0;
    } else {
      setActiveItemIndex(++currentIndex.current);
    }
  }

  const onPrevioeusSlideBtnClick: () => void | undefined = () => {
    clearInterval(sliderTimer.current as NodeJS.Timeout);
    setAnimationNone(true);
    prevIndex.current = currentIndex.current;
    if (currentIndex.current === 0) {
      currentIndex.current = (dataSource?.slides?.contentItems.length || 0) - 1;
      setActiveItemIndex((dataSource?.slides?.contentItems.length || 0) - 1);
    } else {
      setActiveItemIndex(--currentIndex.current)
    }
  }

  const onTabLabelBtnClick = (index: number) => {
    clearInterval(sliderTimer.current as NodeJS.Timeout);
    setAnimationNone(true);
    prevIndex.current = currentIndex.current;
    currentIndex.current = index;
    setActiveItemIndex(index);
  }

  const onCircleElementClick = (index: number) => {
    clearInterval(sliderTimer.current as NodeJS.Timeout);
    setAnimationNone(true);
    prevIndex.current = currentIndex.current;
    currentIndex.current = index;
    setActiveItemIndex(index);
  }

  return (
    <div
      ref={slideShowWidgetRef}
      className={`slide-show-widget progress-bar-${dataSource?.progressBar?.toLowerCase() || ""} ${(dataSource.slides?.contentItems.length || 0) > 1 ? `animation-${dataSource?.animation?.toLowerCase()}` : ""} background-mode-${dataSource?.backgroundMode?.toLowerCase() || ""} ${className ?? ""}`}
    >
      <div className="slide-show-container">
        <SlideShowItems
          contentMediaPath={contentMediaPath}
          dataSource={dataSource}
          prevIndex={prevIndex.current}
          activeItemIndex={activeItemIndex}
          animationNone={animationNone}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onCircleElementClick={onCircleElementClick}
          onNextSlideBtnClick={onNextSlideBtnClick}
          onPrevioeusSlideBtnClick={onPrevioeusSlideBtnClick}
          onTabLabelBtnClick={onTabLabelBtnClick}
        />
      </div>
    </div >
  );
}