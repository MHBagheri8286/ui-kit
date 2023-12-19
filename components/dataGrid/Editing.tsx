/* eslint-disable react-hooks/exhaustive-deps */
import PageController from "@pages/page/PageController";
import Translate from "@service/Translate";
import { FC, useContext } from "react";
import Button from "../form/Button";
import { IFormControlProps } from "../form/Form";
import { Column, DataGridContext } from "./index";

interface ITexts {
    singular?: string;
    addRow?: string;
    editRow?: string;
    saveRowChanges?: string;
    cancelRowChanges?: string;
    deleteRow?: string;
    confirmDeleteMessage?: string;
}
export interface IEditingProps extends IFormControlProps {
    mode?: "row" | "popup";
    row?: any;
    allowAdding?: boolean;
    allowDeleting?: boolean;
    allowUpdating?: boolean;
    texts?: ITexts;
    onRowUpdating?: (record: any) => void;
    onRowRemoving?: (record: any) => void;
}

export const Editing: FC<IEditingProps> = (props) => {
    const { state } = useContext(DataGridContext);
    const { tr } = Translate;
    
    return (
        (props?.allowUpdating || props?.allowDeleting) ?
            <Column
                width={props?.allowDeleting && props?.allowUpdating ? "90px" : "45px"}
                className="column button-edit-remove-group">
                <div className="btn-container">
                    {
                        props?.allowUpdating &&
                        <Button
                            text={state.props?.borderCollapse === "separate" && PageController.handleView("mobileView") ? tr("btn_modify") : ""}
                            icon="icon-edit"
                            loading={state.props?.initialLoading}
                            onClick={() => props?.onRowUpdating && props.onRowUpdating(props?.row)}
                        />
                    }
                    {
                        props?.allowDeleting &&
                        <Button
                            text={state.props?.borderCollapse === "separate" && PageController.handleView("mobileView") ? tr("btn_delete") : ""}
                            icon="icon-delete"
                            loading={state.props?.initialLoading}
                            onClick={() => props?.onRowRemoving && props.onRowRemoving(props?.row)}
                        />
                    }
                </div>
                {props?.children}
            </Column>
            : null
    )
}
Editing.defaultProps = {
    mode: "popup"
}
Editing.displayName = "Editing";
