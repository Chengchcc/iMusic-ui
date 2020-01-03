import React from "react";
import "./style.less";
interface Props {
    className?: string;
    hide: () => any;
}

const SoundController: React.FC<Props> = props => {
    const { className = "", hide } = props;
    React.useEffect(() => {
        document.addEventListener("click", hide);
        return () => document.removeEventListener("click", hide);
    }, []);
    const cls = `${className} sound-controller`;
    return <div className={cls}></div>;
};

export default SoundController;
