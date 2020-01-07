import React from "react";
import useClickRest from "../../../../components/useClickRest";
import "./style.less";
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
