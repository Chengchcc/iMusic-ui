/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import useClickRest from "../../../../components/useClickRest";
import "./style.less";
interface Props {
    className?: string;
    hide: () => any;
}

const VolumeController: React.FC<Props> = props => {
    const { className = "", hide } = props;
    useClickRest({ id: "volume-controller", handler: hide });

    // refs
    const containerRef = React.useRef<HTMLDivElement>(null);
    const progressRef = React.useRef<HTMLDivElement>(null);
    const selectRef = React.useRef<HTMLDivElement>(null);
    const cursorRef = React.useRef<HTMLDivElement>(null);

    const progressMousedownHandler = (e: MouseEvent) => {
        const el = containerRef.current!;
        const el2 = progressRef.current!;
        const el_grant_parent = document.getElementsByClassName(
            "player-container"
        )[0]! as HTMLDivElement;
        const el_parent = document.getElementsByClassName(
            "controller"
        )[0]! as HTMLDivElement;
        const maxHeight = el2.offsetHeight;
        const offsetTop =
            el2.offsetTop +
            el.offsetTop +
            el_parent.offsetTop +
            el_grant_parent.offsetTop;
        const reviseHeight = maxHeight - (e.clientY - offsetTop);
        let reviseProgressValue;
        if (reviseHeight > maxHeight) {
            reviseProgressValue = 1;
        } else if (reviseHeight < 0) {
            reviseProgressValue = 0;
        } else {
            reviseProgressValue = reviseHeight / maxHeight;
        }

        selectRef.current!.setAttribute(
            "style",
            "height:calc(" + reviseProgressValue + " * " + maxHeight + "px )"
        );

        document.onmousemove = e1 => {
            const reviseHeight = maxHeight - (e1.clientY - offsetTop);
            let reviseProgressValue;
            if (reviseHeight > maxHeight) {
                reviseProgressValue = 1;
            } else if (reviseHeight < 0) {
                reviseProgressValue = 0;
            } else {
                reviseProgressValue = reviseHeight / maxHeight;
            }
            selectRef.current!.setAttribute(
                "style",
                "height:calc(" +
                    reviseProgressValue +
                    " * " +
                    maxHeight +
                    "px )"
            );
        };
        document.onmouseup = () => {
            // update player
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    // effects
    React.useEffect(() => {
        progressRef.current?.addEventListener(
            "mousedown",
            progressMousedownHandler
        );
        return () => {
            progressRef.current?.removeEventListener(
                "mousedown",
                progressMousedownHandler
            );
        };
    });

    // render
    const cls = `${className} volume-controller`;
    return (
        <div id="volume-controller" className={cls} ref={containerRef}>
            <div className="volume-progress" ref={progressRef}>
                <div className="volume-filler volume-select" ref={selectRef} />
                <div className="volume-cursor" ref={cursorRef} />
                <div className="volume-filler volume-unselect" />
            </div>
        </div>
    );
};

export default VolumeController;
