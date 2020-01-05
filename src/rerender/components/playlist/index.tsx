import React from "react";
import "./style.less";
import useClickRest from "../useClickRest";
interface Props {
    hide: () => any;
}

const PlayList: React.FC<Props> = props => {
    const { hide } = props;
    useClickRest({
        id: "playBar-playList",
        handler: hide
    });
    return <div id="playBar-playList" className="playBar-playList"></div>;
};

export default PlayList;
