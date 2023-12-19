import { StoreKey } from "@ui-kit/common";
import { Button, Icon, TextArea } from "@ui-kit/components/index";
import { Translate } from "@ui-kit/service";
import Storage from "@ui-kit/service/Storage";
import { FC, useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';

interface IRateUsProps {
    maxRate: number
    onSubmit: (rank: number, comment: string) => Promise<boolean>;
    onHiding: () => void;
}

export const RateUs: FC<IRateUsProps> = ({ maxRate, onHiding, onSubmit }) => {
    const { tr } = Translate;
    const [rate, setRate] = useState<number>(0);
    const [rateHover, setRateHover] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    useEffect(() => {
        if (rate)
            Storage.set(StoreKey.RateUs, rate);
    }, [rate])

    return (
        <div className="rate-us">
            <div className="rate-us-title mb mt-2">{tr("rate_us_title")}</div>
            <article
                className="rate-us-items-container flex flex-center justify-center"
                onMouseLeave={() => setRateHover(rate)}
            >
                {
                    Array(maxRate).fill("").map((x, index) =>
                        <Icon
                            className="pointer"
                            name={`icon-${index + 1 <= (rateHover) ? "star" : "star-outline"}`}
                            size="30px"
                            onClick={() => setRate(index + 1)}
                            onMouseEnter={() => setRateHover(index + 1)}
                        />)
                }
            </article>
            <CSSTransition
                classNames="accordion"
                in={rate ? true : false}
                timeout={{ enter: 500, exit: 10 }}
                unmountOnExit
            >
                <TextArea
                    name="comment"
                    label={`${tr("comment")} ${tr("optional")}`}
                    className="mb"
                    value={comment}
                    onChange={(name: string, value: any) => setComment(value)}
                />
            </CSSTransition>
            <section className="button-container">
                <div className="row flex spa-2">
                    <div className="col-1-3">
                        <Button
                            color="black"
                            variant="outlined"
                            height="40px"
                            className="dialog-btn"
                            text={tr("checkin_seat_cancel")}
                            onClick={() => onHiding()}
                        />
                    </div>
                    <div className="col-2-3">
                        <Button
                            color="primary"
                            variant="contained"
                            height="40px"
                            className="dialog-btn"
                            disabled={rate ? false : true}
                            text={tr("btn_send")}
                            onClickAsync={() => onSubmit(rate, comment)}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}