
import { Button, Dialog, Icon } from "@ui-kit/components/index";
import { Culture } from "@ui-kit/core/index";
import { FC, useState } from "react";

export enum MessageBoxType { Info = 1, Success, Error, Warning }

export enum MessageBoxBtn { Ok = 1, Cancel, Retry, Yes, No, Research, logInAgain }

export enum MessageBoxBtnGroup { OK, OkCancel = 1, OkCancelRetry, CancelRetry, YesNo, Research, logInAgain, YesRetry, Retry }

export interface IMessageBoxProps {
    show: boolean;
    title?: string;
    disable?: boolean;
    type?: MessageBoxType;
    btnGroup?: MessageBoxBtnGroup;
    icon?: string;
    onAction: (btn: MessageBoxBtn) => Promise<boolean> | void;
}

export const MessageBox: FC<IMessageBoxProps> = (props) => {
    const tr = Culture.getDictionary().translate;
    const { title, show, type, icon, children, disable = false, btnGroup, onAction } = props;
    const [showLoadingBtn, setShowLoadingBtn] = useState<boolean>(false);

    const onBtnClick = (btn: MessageBoxBtn) => {
        if (btn === MessageBoxBtn.Yes) {
            setShowLoadingBtn(true);
            (onAction(btn) as Promise<boolean>)
                .finally(() => {
                    setShowLoadingBtn(false);
                })
        }
        else
            onAction(btn)
    }

    const renderOkBtn = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-ok"
                color="primary"
                variant="contained"
                text={tr("btn_ok")}
                disabled={disable}
                loading={showLoadingBtn}
                onClick={() => onBtnClick(MessageBoxBtn.Ok)} />
        </div>
    }

    const renderCancelBtn = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-cancel"
                variant="contained"
                disabled={disable || showLoadingBtn}
                text={tr("btn_cancel")}
                onClick={() => onBtnClick(MessageBoxBtn.Cancel)} />
        </div>
    }

    const renderRetryBtn = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-retry"
                color="primary"
                variant="outlined"
                loading={showLoadingBtn}
                disabled={disable}
                text={tr("btn_retry")}
                onClick={() => onBtnClick(MessageBoxBtn.Retry)} />
        </div>
    }

    const renderYesBtn = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-yes"
                color="primary"
                variant="contained"
                text={tr("btn_yes")}
                disabled={disable}
                loading={showLoadingBtn}
                onClick={() => onBtnClick(MessageBoxBtn.Yes)} />
        </div>
    }

    function renderNoBtn(key: number) {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-no"
                variant="contained"
                text={tr("btn_no")}
                disabled={disable || showLoadingBtn}
                onClick={() => onBtnClick(MessageBoxBtn.No)} />
        </div>
    }

    const renderResearchBtn = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-renderResearch"
                color="secondary"
                variant="contained"
                loading={showLoadingBtn}
                disabled={disable}
                text={tr("research")}
                onClick={() => onBtnClick(MessageBoxBtn.Research)} />
        </div>
    }

    const renderNoResearchBtn = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-research"
                color="secondary"
                variant="contained"
                disabled={disable || showLoadingBtn}
                text={tr("btn_no_research")}
                onClick={() => onBtnClick(MessageBoxBtn.No)} />
        </div>
    }

    const renderLogInAgain = (key: number) => {
        return <div key={key} className="msg-box-btn">
            <Button
                name="btn-logInAgain"
                color="primary"
                variant="contained"
                loading={showLoadingBtn}
                disabled={disable}
                text={tr("btn-login-again")}
                onClick={() => onBtnClick(MessageBoxBtn.logInAgain)}
            />
        </div>
    }

    const renderMessageBoxBtnGroup = () => {
        switch (btnGroup) {
            case MessageBoxBtnGroup.CancelRetry:
                return [
                    renderCancelBtn(2),
                    renderRetryBtn(1)
                ];
            case MessageBoxBtnGroup.OkCancel:
                return [
                    renderCancelBtn(2),
                    renderOkBtn(1)
                ];
            case MessageBoxBtnGroup.OkCancelRetry:
                return [
                    renderCancelBtn(3),
                    renderRetryBtn(2),
                    renderOkBtn(1)
                ];
            case MessageBoxBtnGroup.YesNo:
                return [
                    renderNoBtn(2),
                    renderYesBtn(1)
                ];
            case MessageBoxBtnGroup.Research:
                return [
                    renderResearchBtn(1)
                ];
            case MessageBoxBtnGroup.logInAgain:
                return [
                    renderLogInAgain(1)
                ];
            case MessageBoxBtnGroup.YesRetry:
                return [
                    renderNoResearchBtn(1),
                    renderYesBtn(2)
                ];
            case MessageBoxBtnGroup.Retry:
                return [
                    renderRetryBtn(1),
                ];
            default:
                return [renderOkBtn(1)];
        }
    }

    return (
        <Dialog
            show={show}
            className={`msg-box ${type ? `msg-box-${type}` : ""}`}
            title={title}
            onHiding={() => onAction(MessageBoxBtn.No)}
            animate="fade"
        >
            <div className="msg-box-container">
                <div className="msg-box-content">
                    {icon ?
                        <div className="msg-box-icon">
                            <Icon name={`${icon}`} />
                        </div>
                        : ''
                    }
                    {children}
                </div>
                <div className="msg-box-btn-container">
                    {renderMessageBoxBtnGroup()}
                </div>
            </div>
        </Dialog>

    );
}


