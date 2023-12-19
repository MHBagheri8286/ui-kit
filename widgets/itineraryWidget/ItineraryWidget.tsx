/* eslint-disable react-hooks/exhaustive-deps */
import { DateInMilliSec } from "@ui-kit/common";
import { Icon, Label, OptimizedImage } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { Translate } from "@ui-kit/service";
import { minToMinHour } from "@ui-kit/utilize";
import { IItineraryActivity, IItineraryWidget, IMedia } from "@ui-kit/widgets/index";
import moment from "moment";
import { FC, useEffect, useRef, useState } from "react";

interface IContent {
    descriptions: IItineraryActivity[][];
    images: IMedia[];
}
interface IItineraryWidgetProps {
    contentMediaPath: string;
    dataSource: IItineraryWidget;
    scrollIntoView?: boolean;
}

export const ItineraryWidget: FC<IItineraryWidgetProps> = (props) => {
    const { contentMediaPath, dataSource, scrollIntoView } = props;
    const { tr } = Translate;
    const { numbers } = Culture.getLocale();
    const activeDate = Culture.getDateTimeInstance();
    const nowDate = Culture.getDateTimeInstance();
    const scrollIndex = useRef<number>();
    const activeSlideIndex = useRef<number>(0);
    const activeSlideHeight = useRef<number>(0);
    const scroll = useRef<number>(0);
    const [activeSlideNumber, setActiveSlideNumber] = useState<number>(1);
    const [content, setContent] = useState<IContent>({ descriptions: [[]], images: [] });
    let itemIndex = 0;

    useEffect(() => {
        let day: number = 1;
        dataSource.activities?.contentItems.forEach((activity) => {
            content.images.push(activity.gallery || { paths: [], texts: [] });
            if (activity.day === day) {
                content.descriptions[day - 1].push(activity);
            } else {
                day += 1;
                content.descriptions[day - 1] = [activity];
            }
        });
        setContent({ ...content });
        setTimeout(() => {
            const sliderItems = document.getElementsByClassName('itinerary-slider-content-item') as HTMLCollectionOf<HTMLElement>;
            for (const key in sliderItems) {
                if (Object.prototype.hasOwnProperty.call(sliderItems, key)) {
                    const element = sliderItems[key];
                    element.style.height = `${element.getBoundingClientRect().height}px`;
                }
            }
            if (scrollIntoView) {
                const activeItem = document.getElementById('activeScroll');
                window?.scrollTo({ behavior: 'smooth', top: (activeItem?.getBoundingClientRect().top || 0) - 239 });
            }
        }, 500);
    }, []);

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        return (() => {
            document.removeEventListener('scroll', handleScroll);
        })
    }, [activeSlideNumber])

    const handleScroll = () => {
        const fixTopPiont = 240;
        const itinerarySlider = document.getElementById('itinerarySlider');
        const itinerarySliderBack = document.getElementById('itinerarySliderBack');
        const itinerarySliderContainer = document.getElementById('itinerarySliderContainer');
        const activeSlide = document.getElementById('activeSlide');
        const prevSlide = document.getElementById('prevSlide');
        const nextSlide = document.getElementById('nextSlide');
        const endTravel = document.getElementById('endTravel');
        const itinerarySliderRect = itinerarySlider?.getBoundingClientRect();
        const itinerarySliderContainerRect = itinerarySliderContainer?.getBoundingClientRect();
        const activeSlideRect = activeSlide?.getBoundingClientRect();
        const prevSlideRect = prevSlide?.getBoundingClientRect();
        const nextSlideRect = nextSlide?.getBoundingClientRect();
        const lastSlideIndex = +(activeSlide?.getAttribute('data-last-slide') || '-1');
        const sliderItems = document.getElementsByClassName('itinerary-slider-content-item') as HTMLCollectionOf<HTMLElement>;
        const sliderItemsTitle = document.getElementsByClassName('itinerary-slider-content-title') as HTMLCollectionOf<HTMLElement>;
        const nextSliderItems = document.getElementsByClassName('next-slide') as HTMLCollectionOf<HTMLElement>;

        if (itinerarySlider && itinerarySliderBack && itinerarySliderRect && itinerarySliderContainerRect) {
            if (itinerarySliderRect.top > 0 || itinerarySliderRect.bottom < window.innerHeight) {
                itinerarySliderBack.style.position = 'absolute';
                if (itinerarySliderRect.top > 0) {
                    itinerarySliderBack.style.top = '0px';
                    itinerarySliderBack.style.bottom = 'initial';
                    activeSlideIndex.current = 1;
                } else if (itinerarySliderContainerRect.height > window.innerHeight) {
                    itinerarySliderBack.style.top = 'initial';
                    itinerarySliderBack.style.bottom = '0px';
                    activeSlideIndex.current = sliderItems.length;
                }
                setActiveSlideNumber(activeSlideIndex.current);
            } else {
                itinerarySliderBack.style.position = 'fixed';
                endTravel?.style.setProperty('margin-top', `${window.innerHeight - (600 + sliderItems[sliderItems.length - 1].getBoundingClientRect().height)}px`);
            }

            if (activeSlideRect) {
                if (window.scrollY > scroll.current) {
                    if (!activeSlideHeight.current)
                        activeSlideHeight.current = activeSlideRect.height;
                    if (nextSlideRect && nextSlideRect.top <= fixTopPiont && activeSlideIndex.current < sliderItems.length) {
                        activeSlideHeight.current = nextSlideRect.height;
                        activeSlideIndex.current++;
                        setActiveSlideNumber(activeSlideIndex.current);
                    }
                    else if (lastSlideIndex === -1 && nextSlideRect && nextSlideRect.top < activeSlideRect.height + 350 && activeSlide) {
                        activeSlide.style.maxHeight = `${activeSlideRect.height - (window.scrollY - scroll.current) - 10}px`;
                    }
                    else if (lastSlideIndex !== -1 && sliderItemsTitle.length > 0 && activeSlideRect.top < fixTopPiont) {
                        const title = sliderItemsTitle[lastSlideIndex];
                        title.style.top = `${activeSlideRect.top - 160}px`;
                    } else {
                        for (const key in sliderItemsTitle) {
                            if (Object.prototype.hasOwnProperty.call(sliderItemsTitle, key)) {
                                const element = sliderItemsTitle[key];
                                element.style.top = '';
                            }
                        }
                    }
                } else {
                    if (prevSlide)
                        prevSlide.style.top = '';
                    if (prevSlideRect?.height && activeSlideRect.top >= fixTopPiont + prevSlideRect.height && activeSlideIndex.current > 0) {
                        const preSlideHeight = (prevSlide?.parentNode as HTMLElement).style.height;
                        activeSlideHeight.current = +preSlideHeight.replace('px', '');
                        activeSlideIndex.current--;
                        setActiveSlideNumber(activeSlideIndex.current);
                    }
                    else if (activeSlide && activeSlideRect.height < activeSlideHeight.current) {
                        activeSlide.style.maxHeight = `${activeSlideRect.height + (scroll.current - window.scrollY)}px`;
                    }
                    else if (lastSlideIndex !== -1 && sliderItemsTitle.length > 0) {
                        const title = sliderItemsTitle[lastSlideIndex];
                        if (activeSlideRect.top > 0 && activeSlideRect.top < fixTopPiont) {
                            title.style.top = `${activeSlideRect.top - 160}px`;
                        } else if (activeSlideRect.top >= fixTopPiont) {
                            title.style.top = '';
                        }
                    }
                    else if (activeSlide) {
                        activeSlide.style.maxHeight = ''
                    }

                    for (const key in nextSliderItems) {
                        if (Object.prototype.hasOwnProperty.call(nextSliderItems, key)) {
                            const element = nextSliderItems[key];
                            element.style.maxHeight = '';
                        }
                    }
                }
            }
        }
        scroll.current = window.scrollY;
    }

    return (
        <div className="itinerary-widget">
            <div id="itinerarySlider" className="itinerary-slider">
                <div id="itinerarySliderBack" className="itinerary-slider-image" style={{ height: window.innerHeight }}>
                    {
                        content.images.map((image, index) =>
                            <div
                                key={`slider_image_item_${index}`}
                                className={`itinerary-slider-image-item${activeSlideNumber === index + 1 ? ' active-slide' : ''}`}
                            >
                                <OptimizedImage
                                    key={`slider_image_${index}`}
                                    contentMediaPath={contentMediaPath}
                                    source={image}
                                    imageOption={{ loading: 'lazy' }}
                                />
                            </div>
                        )
                    }
                </div>
                <div id="itinerarySliderContent" className="itinerary-slider-content">
                    <div
                        id="itinerarySliderContainer"
                        className="container"
                    >
                        <div id="itinerarySliderSwipper" className="itinerary-slider-content-swipper" />
                        {
                            content.descriptions.map((description, index) => {
                                const activeDateInTimestamp = (new Date(dataSource.startDate || 0).getTime()) + (index * DateInMilliSec.dayPerMilliSeconds);

                                return (
                                    <div
                                        key={`itinerary_slider_content_${index}`}
                                        className="itinerary-slider-content-description"
                                    >
                                        <div className="itinerary-slider-content-title">
                                            <div>{tr("day_of", numbers.find(n => n.number === index + 1)?.ordinal)}{dataSource.startDate ? <span className="itinerary-slider-content-sub-title">{` ( ${activeDate.setTime(activeDateInTimestamp).format("l d M")} )`}</span> : ''}</div>
                                        </div>
                                        {
                                            description.map((d, i) => {
                                                itemIndex++;
                                                const duration = moment.duration(moment(d.endTime, 'HH:mm:ss').diff(moment(d.startTime, 'HH:mm:ss')));
                                                const minutes = duration.asMinutes();
                                                const nextDescription = description[i + 1];
                                                let time = d.startTime?.split(':') || [];
                                                activeDate.setHours(+time[0], +time[1]);
                                                const activeTime = activeDate.getTime();
                                                if (nextDescription) {
                                                    time = nextDescription.startTime?.split(':') || [];
                                                    activeDate.setHours(+time[0], +time[1]);
                                                } else {
                                                    time = d.endTime?.split(':') || [];
                                                    activeDate.setHours(+time[0], +time[1]);
                                                }
                                                const nextTime = activeDate.getTime();
                                                if (nowDate.getTime() >= activeTime && nowDate.getTime() < nextTime)
                                                    scrollIndex.current = itemIndex

                                                return (
                                                    <div
                                                        key={`slider_content_item_${itemIndex}`}
                                                        id={scrollIndex.current === itemIndex ? 'activeScroll' : ''}
                                                        className="itinerary-slider-content-item"
                                                    >
                                                        <div
                                                            id={itemIndex === activeSlideNumber ? 'activeSlide' : itemIndex === activeSlideNumber - 1 ? 'prevSlide' : itemIndex === activeSlideNumber + 1 ? 'nextSlide' : ''}
                                                            className={`itinerary-slider-content-item-container${activeSlideNumber === itemIndex ? ' active-slide' : itemIndex < activeSlideNumber ? ' prev-slide' : itemIndex > activeSlideNumber ? ` next-slide${scrollIntoView && scrollIndex.current === itemIndex - 1 ? ' show-active-scroll' : ''}` : ''}`}
                                                            data-last-slide={i === description.length - 1 ? index : ''}
                                                            data-active-scroll={tr('next_event')}
                                                        >
                                                            <div className="itinerary-slider-content-item-time">{d.icon ? <Icon name={`icon-${d.icon}`} /> : moment(d.startTime, 'HH:mm:ss').format("HH:mm")}</div>
                                                            <div className="row itinerary-slider-content-item-data">
                                                                <div className="col-1-2 col-md-1-1 col-sm-1-1">
                                                                    <div className="itinerary-slider-content-item-data-title">{d.activity}</div>
                                                                    <div dangerouslySetInnerHTML={{ __html: d.brief?.html || "" }} />
                                                                    {
                                                                        d.startTime && d.endTime &&
                                                                        <div className="itinerary-slider-content-item-detail">
                                                                            <Label
                                                                                icon="icon-restore-clock"
                                                                                mode="inline"
                                                                                text={minToMinHour(minutes)}
                                                                                size="large"
                                                                            />
                                                                            <div></div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        <div id="endTravel" className="itinerary-slider-content-description">
                            <div className="itinerary-slider-content-title">
                                <div>{tr("end_trip")}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}