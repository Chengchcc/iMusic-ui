import React from "react";
import getLyricById from "../../../../services/lyric";
import store from "../../../../reducers";
import { createAction } from "../../../../util/aciton";
import { useSelector } from "react-redux";

import "./style.less";

interface Props {
    songId: number;
    className?: string;
}

const getlyric = async (id: number) => {
    const lyric = await getLyricById(id);
    store.dispatch(createAction("lyric/update")({ lyric }));
};

const LyricComponent: React.FC<Props> = props => {
    const { songId, className } = props;

    //selector
    const lyric = useSelector((state: any) => state.get("lyric").get("lyric"));

    // effects
    React.useEffect(() => {
        getlyric(songId);
    }, [songId]);

    React.useEffect(() => {
        // registery audio
        const handler = () => {
            console.log("");
        };
        const audio = document.getElementById("audio") as HTMLAudioElement;
        audio.addEventListener("timeupdate", handler);
        return () => {
            audio.removeEventListener("timeupdate", handler);
        };
    }, []);

    // renders
    return <div className={`${className} lyric`}></div>;
};

export default LyricComponent;
