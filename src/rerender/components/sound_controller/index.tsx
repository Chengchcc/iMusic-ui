import React from "react";
import "./style.less";
import useClickRest from "../useClickRest";
interface Props {
    className?: string;
    hide: () => any;
    onFocus: () => any;
    onBlur: () => any;
}

const SoundController: React.FC<Props> = props => {
    const { className = "", hide, onBlur, onFocus } = props;
    useClickRest({ id: "sound-controller", handler: hide, onBlur, onFocus });
    const cls = `${className} sound-controller`;
    return <div id="sound-controller" className={cls}></div>;
};

export default SoundController;
