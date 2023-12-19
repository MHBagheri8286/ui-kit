/* eslint-disable react-hooks/exhaustive-deps */
import { ViewPort } from "@ui-kit/common";
import { Button, Icon, Modal, OptimizedBackgroundImage } from "@ui-kit/components/index";
import { Translate } from "@ui-kit/service";
import { getWidth, hexToRgb } from "@ui-kit/utilize";
import { IBackgroundColorStyle, IMedia, ISizingStyle, ISlideshowWidget, getCustomization, getFilePath } from "@ui-kit/widgets/index";
import { FC, useEffect, useRef, useState } from "react";
import TabLabels from "./TabLabels";

export interface IFullVideoSource {
  poster: string;
  source: string;
}

interface ISlideShowWidgetProps {
  activeItemIndex: number;
  contentMediaPath: string;
  dataSource: ISlideshowWidget;
  prevIndex: number;
  animationNone?: boolean;
  onTouchStart: (event: any) => void;
  onTouchEnd: (event: any) => void;
  onCircleElementClick: (index: number) => void;
  onNextSlideBtnClick: () => void;
  onPrevioeusSlideBtnClick: () => void;
  onTabLabelBtnClick: (index: number) => void;
}

export const SlideShowItems: FC<ISlideShowWidgetProps> = ({
  contentMediaPath,
  dataSource,
  prevIndex,
  activeItemIndex,
  animationNone,
  onTouchStart,
  onTouchEnd,
  onCircleElementClick,
  onNextSlideBtnClick,
  onPrevioeusSlideBtnClick,
  onTabLabelBtnClick
}) => {
  const { tr } = Translate;
  const slidShowItemsRef = useRef<HTMLLIElement[]>([]);
  const slideShowItemsListRef = useRef<HTMLUListElement>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const { small } = ViewPort;
  const [fullVideoDialogVisible, setFullVideoDialogVisible] = useState<boolean>(false);
  const [fullVideoSource, setFullVideoSource] = useState<IFullVideoSource>();
  const allowedExtentionsVideos: string[] = ["mp4"];
  const widthTimer = useRef<NodeJS.Timeout>();
  const [width, SetWidth] = useState<number>(getWidth());

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return (() => window.removeEventListener("resize", onResize))
  }, [])

  const onResize = () => {
    clearTimeout(widthTimer.current as NodeJS.Timeout);
    widthTimer.current = setTimeout(() => {
      SetWidth(getWidth());
    }, 200);
  }

  useEffect(() => {
    setTimeout(() => {
      videoRefs.current[activeItemIndex] && videoRefs.current[activeItemIndex].play();
    }, 2000)
    addAnimationToSlide(activeItemIndex);
  }, [activeItemIndex])

  const addAnimationToSlide = (currentIndex: number) => {
    if (currentIndex < prevIndex)
      slideShowItemsListRef.current?.classList.add("prev-slide");
    else
      slideShowItemsListRef.current?.classList.remove("prev-slide");

    switch (dataSource.animation) {
      case "SlideAndZoomOut":
        slidShowItemsRef.current.forEach((element, i) => {
          if (i < currentIndex)
            element.style.transform = 'translateX(-100%)';
          else if (i > currentIndex)
            element.style.transform = 'translateX(100%)';
          else
            element.style.transform = 'translateX(0)';
        });
        slidShowItemsRef.current.forEach((element, i) => {
          if (i === prevIndex || i === currentIndex)
            element.style.opacity = '1';
          else
            element.style.opacity = '0';
        });
        break;

      case "Slide":
        slidShowItemsRef.current.forEach((element, i) => {
          if (i < currentIndex)
            element.style.transform = 'translateX(-100%)';
          else if (i > currentIndex)
            element.style.transform = 'translateX(100%)';
          else
            element.style.transform = 'translateX(0)';
        });
        slidShowItemsRef.current.forEach((element, i) => {
          if (i === prevIndex || i === currentIndex)
            element.style.opacity = '1';
          else
            element.style.opacity = '0';
        });
        break;
    }
  }

  const onFullVideoPlayClick = (source: IFullVideoSource) => {
    videoRefs.current[activeItemIndex] && videoRefs.current[activeItemIndex].pause();
    setFullVideoDialogVisible(true);
    setFullVideoSource(source);
  }

  const onCloseFullVideoBtnClick = () => {
    videoRefs.current[activeItemIndex] && videoRefs.current[activeItemIndex].play();
    setFullVideoDialogVisible(false);
  }
  const circleElementInitialize: string[] = dataSource?.slides?.contentItems.length ? dataSource?.slides?.contentItems.map(() => "") : [];
  const circleElement = circleElementInitialize.map((item, index) => (
    <div
      key={index}
      onClick={() => onCircleElementClick(index)}
      className={`circle ${index === activeItemIndex ? 'active' : 'hide'}`}
    >
      {item}
    </div>
  ))
  const backgroundColorStyle = getCustomization<IBackgroundColorStyle>(dataSource?.customizations, "BackgroundColorStyle");
  const hexToRgba = backgroundColorStyle?.color ? hexToRgb(backgroundColorStyle.color) : null;

  return (
    <div className="slide-show-items-wrapper flex-grow" >
      {
        (dataSource?.slides?.contentItems.length || 0) > 1 && (dataSource?.progressBar === "InsideTab" || dataSource.progressBar === "OutsideTab") &&
        <TabLabels
          dataSource={dataSource}
          activeItemIndex={activeItemIndex}
          animationNone={animationNone}
          onTabLabelBtnClick={onTabLabelBtnClick}
        />
      }
      <ul
        ref={slideShowItemsListRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`slide-show-items ${dataSource?.backgroundMode !== "Full" ? "container" : ""}`}
        style={{ height: (dataSource?.slides?.contentItems.length || 0) === 1 || (getCustomization<ISizingStyle>(dataSource?.customizations, "SizingStyle")?.heightMode === "Full") ? "100%" : "" }}
      >
        {
          dataSource?.slides?.contentItems.map((slide, index) => {
            const videoSource = slide.media?.paths.find(x => allowedExtentionsVideos.some(extention => x.substring(x.indexOf(".") + 1) === extention));
            const videoPoster = slide.media?.paths.find(x => !allowedExtentionsVideos.some(extention => x.substring(x.indexOf(".") + 1) === extention));
            const fullVideoSource = slide.media?.texts.some(x => x === "FullVideo") && slide.media.paths[slide.media.texts.findIndex(x => x === "FullVideo")];

            return (
              <li
                key={index}
                ref={ref => slidShowItemsRef.current[index] = ref as HTMLLIElement}
                className={`row spa-0 slide-show-item${index === activeItemIndex ? ' active-slide' : ''}`}
              >
                <div className="col-1-auto col-md-1-1 col-sm-1-1 content-section">
                  <div className="content-background">
                    {
                      slide.media?.paths.length &&
                      <div className="poster">
                        <OptimizedBackgroundImage
                          index={videoSource ? slide.media?.paths.findIndex(x => x === videoPoster) : 0}
                          source={slide.media as IMedia}
                          contentMediaPath={contentMediaPath}
                          sizeBasis="height"
                          flip={slide.flip}
                          positionX={slide.positionX}
                        />
                      </div>
                    }
                    <div
                      style={{
                        backgroundColor: backgroundColorStyle?.color ?
                          `rgba(${hexToRgba?.r},${hexToRgba?.g},${hexToRgba?.b},${(backgroundColorStyle?.opacity || 100) / 100})` : "rgb(52, 52, 52)",
                      }}
                      className="background"
                    />
                  </div>
                  {
                    videoSource &&
                    <video
                      ref={ref => videoRefs.current[index] = ref as HTMLVideoElement}
                      playsInline
                      muted
                      className="video-source"
                      width="100%"
                      height="100%"
                      poster={getFilePath(contentMediaPath, videoPoster || '')}
                      loop
                    >
                      <source src={getFilePath(contentMediaPath, videoSource)} type="video/mp4" />
                      {tr("msg_not_support_video")}
                    </video>
                  }
                </div>
                {
                  slide.textOverly?.html &&
                  <div className="col-1-auto col-md-1-1 col-sm-1-1 caption-section">
                    <div className="container">
                      <div className="caption-section-wrapper">
                        <div className="article" dangerouslySetInnerHTML={{ __html: slide.textOverly.html || "" }} />
                        <div className="row flex flex-center">
                          {
                            fullVideoSource &&
                            <div className="col-1-auto mt-4">
                              <Icon
                                circle
                                size="48px"
                                name="icon-paly-video"
                                onClick={() => onFullVideoPlayClick({ poster: videoPoster || "", source: fullVideoSource })}
                              />

                            </div>
                          }
                          {
                            slide.navigation?.text && slide.navigation.url &&
                            <div className="col-1-auto mt-4">
                              <Button
                                className="navigation-btn"
                                variant="outlined"
                                color="white"
                                text={slide.navigation.text}
                                width="auto"
                                height="35px"
                                url={slide.navigation.url}
                                target={slide.navigation.url.startsWith('/') ? undefined : "_blank"}
                              />
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </li>
            )
          }
          )
        }
      </ul>
      {
        (dataSource?.slides?.contentItems.length || 0) > 1 &&
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="controls-container flex"
        >
          <Icon
            name='icon-chevron-left'
            flipRtl
            className={`${!dataSource.autoDisplay && activeItemIndex === 0 ? " hide" : ""}`}
            onClick={onPrevioeusSlideBtnClick}
          />
          <div className="flex flex-center circle-bar">{circleElement}</div>
          <Icon
            name='icon-chevron-right'
            flipRtl
            className={`${!dataSource.autoDisplay && activeItemIndex === (dataSource.slides?.contentItems.length || 0) - 1 ? " hide" : ""}`}
            onClick={onNextSlideBtnClick}
          />
        </div>
      }
      {
        width > small && (dataSource?.slides?.contentItems.length || 0) > 1 && dataSource?.progressBar === "Stack" && <div className="progress-bar">
          <span
            className="pagination-fill"
            style={{ width: `${(activeItemIndex + 1) * (100 / (dataSource.slides?.contentItems.length || 0))}%` }}
          />
        </div>
      }
      {
        fullVideoSource?.source &&
        <Modal
          name="fade"
          style={{ width: "100%", height: "100%" }}
          show={fullVideoDialogVisible}
          onClose={onCloseFullVideoBtnClick}
        >
          <div className="full-video">
            <div className="full-video-container flex">
              <div className="video-section">
                <video
                  autoPlay
                  controls
                  className="video-source"
                  width="100%"
                  height="100%"
                  poster={getFilePath(contentMediaPath, fullVideoSource?.poster)}
                >
                  <source src={getFilePath(contentMediaPath, fullVideoSource?.source)} type="video/mp4" />
                  {tr("msg_not_support_video")}
                </video>
              </div>
            </div>
            <Icon
              circle
              size="48px"
              name="icon-close"
              onClick={onCloseFullVideoBtnClick}
            />
          </div>
        </Modal>
      }
    </div>
  );
}