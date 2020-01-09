import React from "react";
import "./style.less";
const { remote } = window.require("electron");
const KEY_ALT = 18;

const currentWindow = remote.getCurrentWindow();
const isWindows = window.clientInformation.platform === "Win32";

const Titlebar: React.FC<{ title: string }> = (props: any) => {
    const [keyAltDown, setKeyAltDown] = React.useState(false);
    const [isMaximized, setIsMaximized] = React.useState(
        currentWindow.isMaximized()
    );
    React.useEffect(() => {
        if (!isWindows) {
            document.body.addEventListener("keydown", handleKeyDown);
            document.body.addEventListener("keyup", handleKeyUp);
        }
        return () => {
            if (!isWindows) {
                document.body.addEventListener("keydown", handleKeyDown);
                document.body.addEventListener("keyup", handleKeyUp);
            }
        };
    });

    const handleClose = () => {
        currentWindow.close();
    };

    const handleKeyDown = (e: any) => {
        if (e.keyCode === KEY_ALT) {
            setKeyAltDown(true);
        }
    };

    const handleKeyUp = (e: any) => {
        if (e.keyCode === KEY_ALT) {
            setKeyAltDown(false);
        }
    };

    const handleMinimize = () => {
        currentWindow.minimize();
    };

    const handleMaximize = () => {
        if (isWindows) {
            if (currentWindow.isMaximizable()) {
                if (currentWindow.isMaximized()) {
                    currentWindow.unmaximize();
                    setIsMaximized(false);
                } else {
                    currentWindow.maximize();
                    setIsMaximized(true);
                }
            }
        } else {
            if (keyAltDown) {
                if (currentWindow.isMaximizable()) {
                    if (currentWindow.isMaximized()) {
                        currentWindow.unmaximize();
                    } else {
                        currentWindow.maximize();
                    }
                }
            } else {
                currentWindow.setFullScreen(!currentWindow.isFullScreen());
                setIsMaximized(!currentWindow.isFullScreen());
            }
        }
    };

    const renderMac = () => {
        return (
            <div className="title-controls" key="title-controls">
                <button className="button-mac-close" onClick={handleClose}>
                    <svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
                        <polygon
                            fill="#4d0000"
                            points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"
                        ></polygon>
                    </svg>
                </button>
                <button
                    className="button-mac-minimize"
                    onClick={handleMinimize}
                >
                    <svg x="0px" y="0px" viewBox="0 0 8 1.1">
                        <rect fill="#995700" width="8" height="1.1"></rect>
                    </svg>
                </button>
                <button
                    className="button-mac-maximize"
                    onClick={handleMaximize}
                >
                    <svg
                        className={"fullscreen-svg"}
                        x="0px"
                        y="0px"
                        viewBox="0 0 6 5.9"
                    >
                        <path
                            fill="#006400"
                            d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z"
                        ></path>
                        <path
                            fill="#006400"
                            d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z"
                        ></path>
                    </svg>
                    <svg
                        className={"maximize-svg"}
                        x="0px"
                        y="0px"
                        viewBox="0 0 7.9 7.9"
                    >
                        <polygon
                            fill="#006400"
                            points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"
                        ></polygon>
                    </svg>
                </button>
            </div>
        );
    };

    const renderWindows = () => {
        return (
            <div className="title-controls" key="title-controls">
                <button
                    className="button-win"
                    aria-label="minimize"
                    onClick={handleMinimize}
                >
                    <svg
                        version="1.1"
                        aria-hidden="true"
                        width="10"
                        height="10"
                    >
                        <path d="M 0,5 10,5 10,6 0,6 Z" />
                    </svg>
                </button>
                <button
                    className="button-win"
                    aria-label="maximize"
                    onClick={handleMaximize}
                >
                    {isMaximized ? (
                        <svg
                            version="1.1"
                            aria-hidden="true"
                            width="10"
                            height="10"
                        >
                            <path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z" />
                        </svg>
                    ) : (
                        <svg
                            version="1.1"
                            aria-hidden="true"
                            width="10"
                            height="10"
                        >
                            <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
                        </svg>
                    )}
                </button>
                <button
                    className="button-win-close"
                    aria-label="close"
                    onClick={handleClose}
                >
                    <svg
                        aria-hidden="true"
                        version="1.1"
                        width="10"
                        height="10"
                    >
                        <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
                    </svg>
                </button>
            </div>
        );
    };

    const { title } = props;
    const elements = [];

    if (isWindows) {
        elements.push(
            <div
                className={isWindows ? "title-text-win" : "title-text-mac"}
                key="title-text"
            >
                {title}
            </div>
        );
        elements.push(renderWindows());
    } else {
        elements.push(renderMac());
        elements.push(
            <div
                className={isWindows ? "title-text-win" : "title-text-mac"}
                key="title-text"
            >
                {title}
            </div>
        );
    }

    return (
        <div
            className={
                isWindows ? "title-container-win" : "title-container-mac"
            }
        >
            {elements}
        </div>
    );
};

export default Titlebar;
