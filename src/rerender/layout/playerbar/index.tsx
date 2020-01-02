import React from "react";
import { useSelector } from "react-redux";
import { createAction } from "../../util/aciton";
import store from "../../reducers";

import "./style.less";

const getMode = (id: number) => {
    switch (id) {
        case 0:
            return "sequence";
        case 1:
            return "loop";
        case 2:
            return "random";
        default:
            return "";
    }
};

const swithMode = (id: number) => {
    store.dispatch(
        createAction("playlist/swithMode")({
            mode: (id + 1) % 3
        })
    );
};

const playSong = (flag: boolean) => {
    store.dispatch(
        createAction("playlist/playSong")({
            flag
        })
    );
};

const Playerbar = () => {
    const mode = useSelector((state: any) => state.get("playlist").get("mode"));
    const playing = useSelector((state: any) =>
        state.get("playlist").get("playing")
    );
    return (
        <div className="player-container">
            <div className="mediainfo"></div>
            <div className="timeline"></div>
            <div className="controller">
                <button className="previous" title="previous" />
                <button
                    className={playing ? "pause" : "play"}
                    onClick={() => playSong(!playing)}
                    title={playing ? "pause" : "play"}
                />
                <button className="next" title="next" />
                <button
                    className={`${getMode(mode)}`}
                    onClick={() => swithMode(mode)}
                    title={`${getMode(mode)}`}
                />
                <button className="list" title="list" />
            </div>
        </div>
    );
};

export default Playerbar;
