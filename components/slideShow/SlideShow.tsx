/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from "@ui-kit/components/index";
import { FC, useEffect, useRef, useState } from "react";

export interface ISliderItem {
  src: string;
  url?: string;
  path?: string
}

interface ISlideShowProps {
  dataSource: ISliderItem[];
}

export const SlideShow: FC<ISlideShowProps> = (props) => {
  const { dataSource } = props;
  const interval = 4000;
  const [activeItem, setActiveItem] = useState<number>(0);
  const timer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    let i = 1;
    timer.current = setInterval(() => {
      setActiveItem(i++);
      if (i === dataSource.length)
        i = 0;
    }, interval);
  }, []);

  const toRight: (e: any) => void | undefined = () => {
    clearInterval(timer.current as NodeJS.Timeout);
    let i = 1;
    timer.current = setInterval(() => {
      setActiveItem(i++);
      if (i === dataSource.length)
        i = 0;

    }, interval);
    if (activeItem === dataSource.length - 1) {
      setActiveItem(0);
    } else {
      setActiveItem(activeItem + 1);
    }
  }

  const toLeft: (e: any) => void | undefined = () => {
    clearInterval(timer.current as NodeJS.Timeout)
    let i = 1;
    timer.current = setInterval(() => {
      setActiveItem(i++);
      if (i === dataSource.length)
        i = 0;

    }, interval);
    if (activeItem === 0) {
      setActiveItem(dataSource.length - 1)
    } else {
      setActiveItem(activeItem - 1)
    }
  }

  const circleElementInitialize: string[] = dataSource.map(() => "");
  const circleElement = circleElementInitialize.map((item, index) => (
    <div className={`${index === activeItem ? 'circle-active' : 'circle-hide'}`}>{item}</div>
  ))

  const images = dataSource.map((item, index) =>
  (
    <img
      key={index}
      id={index.toString()}
      className={`${index === activeItem ? `active` : 'hide'}`}
      src={item.src}
      alt="slide-show-pictures"
    />
  )
  );

  return (
    <section className="slide-show">
      <section className="images-container">
        {images.length > 1 ? images : ''}
      </section>
      {images.length > 1 ? <section className='selection'>
        <Icon name='icon-chevron-right' onClick={toLeft} />
        {circleElement}
        <Icon name='icon-chevron-left' onClick={toRight} />
      </section> : ''}
    </section>
  );
};
