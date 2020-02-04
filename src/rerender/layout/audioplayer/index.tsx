import React from "react";
import { useSelector } from "react-redux";
import { getSongUrl } from "../../services";
import store from "../../reducers";
import { createAction } from "../../util/aciton";

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
        if (currentSong.id) {
            getSongUrl(currentSong.id).then((data: any) => {
                audio.src = data.data[0].url;
                if (playing) {
                    audio.play();
                }
            });
        }
    }, [currentSongIMM]);

    React.useEffect(() => {
        if (playing) {
            audio.play().catch(console.log);
        } else {
            audio.pause();
        }
    }, [playing]);
    React.useEffect(() => {
        audio.addEventListener("ended", () => {
            store.dispatch(createAction("playlist/next")());
        });
    }, []);

    return <></>;
};

export default AudioPlayer;
