import document from '@assets/images/icons/doc.svg';
import pdf from '@assets/images/icons/pdf.svg';
import { ViewPort } from '@ui-kit/common';
import { ChangeEventHandler, Icon, IFormControlProps } from "@ui-kit/components/index";
import { Culture, Mime } from "@ui-kit/core/index";
import { Translate } from '@ui-kit/service';
import { getWidth, resizeFile } from '@ui-kit/utilize';
import heic2any from "heic2any";
import { ChangeEvent, FC, Fragment, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";
import { FieldError, useController, useForm } from 'react-hook-form';
export interface IBase64 {
    content: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    creationTime: number;
}

export interface IFileUpload {
    allowedExtentions: string;
    maxFilesCount: number;
    maxFileSize: number;
}
export interface IOptionsResizer {
    width: number;
    height: number;
    format: "JPEG" | "PNG" | "JPG";
    quality: number;
    rotation: number;
    outputFormat: "file" | "string";
}
interface IFileInputProps extends IFormControlProps {
    accept?: string;
    multiple?: boolean;
    fileUpload: IFileUpload;
    value?: IBase64 | File | (File | IBase64)[];
    id?: string;
    onError: (error: string | ReactNode) => void;
    onRemove?: ChangeEventHandler;
}

export const FileInput: FC<IFileInputProps> = (props) => {
    const { tr, re } = Translate;
    const { dir } = Culture.getLocale();
    const { small } = ViewPort;
    const [loadingFiles, setLoadingFiles] = useState<string[]>([]);
    const allowedExtentions = props.fileUpload?.allowedExtentions.split(",").map(a => `.${a}`).toString() || "";
    const [width, SetWidth] = useState<number>(getWidth());
    const widthTimer = useRef<NodeJS.Timeout>();
    const { control } = useForm();
    const { field: { onChange, ref } } = useController({
        name: props.validate?.name ?? (props.name || ""),
        control: props.validate?.control ?? control
    });

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

    const contentLoader = <ContentLoader
        width="100%"
        height="100%"
        title={tr("msg_info_loading")}
        speed={1}
        rtl={dir === "rtl"}
        backgroundColor="#d9d9d9"
        foregroundColor="#ecebeb"
    >
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
    </ContentLoader>

    const deleteIconLoader = <ContentLoader
        width="100%"
        height="100%"
        title={tr("msg_info_loading")}
        speed={1}
        backgroundColor="#d9d9d9"
        foregroundColor="#ecebeb"
        rtl={dir === "rtl"}
        className="skeleton-search-result-section"
    >
        <circle cx="12" cy="12" r="12" />
        {/* Only SVG shapes */}
    </ContentLoader>

    const getAppropriateFileWrapper = (fileType: string, src: string) => {
        switch (fileType) {
            case "image":
                return <img src={src} alt="file input" />;
            case "video":
                return <video controls={true}><source src={src} /></video>;
            case "application":
                return <img src={pdf} alt="file input" />;
            default:
                return <img src={document} alt="file input" />;
        }
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.multiple) {
            const targetFiles = e.target.files;
            if (targetFiles?.length && (targetFiles.length + ((props.value as (File | IBase64)[])?.length || 0) <= (props.fileUpload?.maxFilesCount || 2))) {
                for (let i = 0, il = targetFiles.length; i < il; ++i) {
                    const file = targetFiles[i];
                    const extention = Mime.getExt(file.type);
                    if (allowedExtentions.includes(extention)) {
                        if (["heif", "heic"].includes(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())) {
                            loadingFiles.push(file.name);
                            setLoadingFiles(loadingFiles.slice());
                            heic2any({ blob: file, toType: "image/jpeg", quality: 0.5 })
                                .then((newFile: any) => {
                                    newFile.lastModifiedDate = file.lastModified;
                                    newFile.name = file.name.substring(0, file.name.indexOf(".")) + ".jpeg";
                                    resizeFile(newFile, { width: 1024, height: 1024, format: "JPEG", quality: 100, rotation: 0, outputFormat: "file" })
                                        .then((file: any) => onFileInputChange(file))
                                        .finally(() => {
                                            setLoadingFiles((prevState) => (prevState.filter(x => x !== file.name)));
                                        })
                                }
                                )
                                .catch(() => {
                                    setLoadingFiles((prevState) => (prevState.filter(x => x !== file.name)));
                                })
                        }
                        else if (["png", "jpeg", "jpg"].includes(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())) {
                            loadingFiles.push(file.name);
                            setLoadingFiles(loadingFiles.slice());
                            resizeFile(file, { width: 1024, height: 1024, format: "JPEG", quality: 100, rotation: 0, outputFormat: "file" })
                                .then((file: any) => onFileInputChange(file))
                                .finally(() => {
                                    setLoadingFiles((prevState) => (prevState.filter(x => x !== file.name)));
                                })
                        }
                        else
                            onFileInputChange(file)
                    }
                }
            }
            else
                props.onError && props.onError(tr("upload_limitation_max_files", props.fileUpload?.maxFilesCount));
        } else {
            props.validate && onChange(e.target.files ? e.target.files[0] : undefined);
            props.name && props.onChange && props.onChange(props.name, e.target.files ? e.target.files[0] : undefined);
        }
        e.target.value = '';

        function onFileInputChange(file: File) {
            if (file.size <= (props.fileUpload?.maxFileSize || 0) * 1024) {
                props.validate && onChange([file]);
                props.name && props.onChange && props.onChange(props.name, [file]);
            }
            else
                props.onError && props.onError(re("upload_limitation_allow_extentions", <span className="en">{props.fileUpload?.allowedExtentions?.toUpperCase()?.replace(/,/g, ", ")}</span>, (props.fileUpload?.maxFileSize || 0) / 1024));
        }
    }

    const removeFile = (index: number) => () => {
        if (props.name && props.onRemove) {
            if (props.multiple) {
                (props.value as (File | IBase64)[]).splice(index, 1);
                props.onRemove(props.name, props.value);
            } else {
                props.onRemove(props.name, null);
            }
        }
    }

    const renderLoadingFiles = () => {
        const thumbnails: ReactElement[] = [];
        loadingFiles.forEach((loadingFile, index) => {
            thumbnails.push(<div key={index} className="file-wrapper">
                <div className="file-prev-setion">{contentLoader}</div>
                <div className="file-detail-section">
                    <div className="file-detail-section-item file-detail-section-name">{contentLoader}</div>
                    <div className="file-detail-section-item flex flex-center format-converting">{tr("format_converting")}</div>
                </div>
                <span className="file-del">{deleteIconLoader}</span>
            </div>)
        })
        return (
            thumbnails.length ? <div className="thumbnails skeleton">{thumbnails}</div> : ""
        )
    }

    const renderThumbnails = () => {
        if (!props.value) { return null; }
        const files: (File | IBase64)[] = [];
        const thumbnails: ReactElement[] = [];
        const fileLength = (props.value as (IBase64 | File)[]).length;
        if (props.multiple)
            for (let i = 0; i < fileLength; ++i)
                files.push((props.value as (IBase64 | File)[])[i]);
        else
            files.push(props.value as IBase64 | File);

        files.forEach((file, i) => {
            let src = "";
            let fileType = "";
            let fileName = "";
            let fileSize = 0;
            let mime = "";
            if (file instanceof File) {
                const file: File = files[i] as File;
                fileName = file.name;
                fileSize = file.size;
                if (file.type.indexOf("image/") === 0) {
                    src = URL.createObjectURL(file);
                    fileType = "image";
                } else {
                    src = `data:${file.type}`;
                    fileType = src.substring(5, src.indexOf("/"));
                }
            }
            else {
                src = file.content;
                fileType = file.fileType.includes("/") ? file.fileType.substring(file.fileType.indexOf("/") + 1, file.fileType.length) : file.fileType;
                fileName = file.fileName;
                fileSize = file.fileSize;
                const mimeTypes = Mime.getMime(fileType);
                if (mimeTypes.length) {
                    const mimeType = mimeTypes[0];
                    mime = mimeType.substring(0, mimeType.indexOf("/"));
                }
            }
            const wrapper = getAppropriateFileWrapper(mime, src);
            const content = (
                <>
                    <div className="file-prev-setion">
                        {wrapper}
                    </div>
                    <div className="file-detail-section">
                        <div className="file-detail-section-item file-detail-section-name trim">{fileName}</div>
                        <div className="file-detail-section-item flex flex-center en">
                            <span>{fileType?.toUpperCase()}</span>
                            <span className="dot"></span>
                            <span>{(Math.round(fileSize / 1024)).toLocaleString()}KB</span>
                        </div>
                    </div>
                </>
            )
            thumbnails.push(
                props.readonly ? <a key={i} className="file-wrapper" href={src} target="_blank" rel="noreferrer">{content}</a> :
                    <div key={i} className="file-wrapper">
                        {content}
                        <Icon className="file-del" name="icon-delete" onClick={removeFile(i)} />
                    </div>
            );
        })
        return (
            thumbnails.length ? <div className="thumbnails">{thumbnails}</div> : ""
        );
    }

    return (
        <div style={props.style} className={`file-input${props.className ? ` ${props.className}` : ""}${props.error ? " has-error" : ""}${props.value ? " has-value" : ""}`}>
            {!props.readonly ? <Fragment>
                <div className="form-container">
                    <input
                        id={props.id}
                        ref={ref}
                        className="file-input-wrapper"
                        name={props.name}
                        type="file"
                        title=""
                        multiple={props.multiple}
                        placeholder={props.placeholder}
                        accept={allowedExtentions}
                        disabled={props.disabled}
                        onChange={onInputChange}
                    />
                    <span className="file-input-txt">
                        <Icon className="file-input-txt-icon" name="icon-attachment" />
                        {width > small ? re("upload_browse", <span className="browse-file">{tr("browse")}</span>)
                            : <span className="browse-file">{tr("browse")}</span>}{props.required ? <Icon name="icon-required" className="filed-required" size="8px" /> : null}
                    </span>
                </div>
                <div className="upload-limitation">{re("upload_limitation_tip", props.fileUpload?.maxFilesCount, <span className="en">{props.fileUpload?.allowedExtentions?.toUpperCase()?.replace(/,/g, ", ")}</span>, (props.fileUpload?.maxFileSize || 0) / 1024)}</div>
                <p className="form-error">{(props.error as FieldError)?.message}</p>
            </Fragment>
                : ""}

            <div className="file-input-prev">
                {renderThumbnails()}
                {renderLoadingFiles()}
            </div>
        </div>
    );

}
