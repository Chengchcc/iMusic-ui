import React from "react";
import { useSelector } from "react-redux";

export const audio = new Audio();

const AudioPlayer: React.FC = () => {
    // refs

    // selectors
    const currentSongIMM = useSelector((state: any) =>
        state.get("playlist").get("currentSong")
    );
    const playing = useSelector((state: any) =>
        state.get("playlist").get("playing")
    );

    //effects
    React.useEffect(() => {
        const currentSong = currentSongIMM.toJS();
        audio.src = currentSong.src;
    }, [currentSongIMM]);

    React.useEffect(() => {
        if (playing) {
            audio.play().catch(console.log);
        } else {
            audio.pause();
        }
    }, [playing]);

    return <></>;
};

export default AudioPlayer;
