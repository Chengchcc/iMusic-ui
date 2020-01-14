/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import getLyricById from "../../../../services/lyric";
import store from "../../../../reducers";
import { createAction } from "../../../../util/aciton";
import { useSelector } from "react-redux";
import { audio } from "../../../audioplayer";
import Loader from "../../../../components/loader";

import "./style.less";

interface Props {
    songId: number;
    className?: string;
}

const getlyric = async (id: number) => {
    const lyric = await getLyricById(id);
    store.dispatch(createAction("lyric/update")({ lyric }));
};

const getLyricsKey = (times: any, lyrics: any) => {
    const keys = Object.keys(lyrics);
    return keys.find(
        (e, index) =>
            times > +e && index < keys.length - 1 && times < +keys[index + 1]
    );
};

const renderLyrics = (lyrics: any) => {
    const times = Object.keys(lyrics);
    if (times.length === 0) {
        return (
            <div className="placeholder">
                <span>Nothing ...</span>
            </div>
        );
    }

    return times.map((e, index) => {
        return (
            <p data-times={e} key={index}>
                <span>{lyrics[e]}</span>
            </p>
        );
    });
};

const LyricComponent: React.FC<Props> = props => {
    const { songId, className } = props;
    // state
    const [isLoading, setIsLoading] = React.useState(false);
    //selector
    const lyric = useSelector((state: any) => state.get("lyric").get("lyric"));
    const lyricJs = React.useRef(lyric.toJS());

    // handlers
    const handler = React.useCallback(() => {
        const lyricsEle = document.getElementsByClassName("lc-lyrics")[0]!;
        const key = getLyricsKey(audio.currentTime * 1000, lyricJs.current);
        if (!lyricsEle) {
            return;
        }
        const currentPlaying = lyricsEle.querySelector(
            `[playing][data-times='${key}']`
        );
        if (currentPlaying) {
            return;
        }
        if (key) {
            const playingEleArray = lyricsEle.querySelectorAll("[playing]");
            const playing = lyricsEle.querySelector(`[data-times='${key}']`);
            playingEleArray.forEach((e: any) => e.removeAttribute("playing"));
            if (playing && !playing.getAttribute("playing")) {
                playing.setAttribute("playing", "true");
                if (
                    lyricsEle
                        ?.querySelector("section")
                        ?.getAttribute("scrolling")
                ) {
                    return;
                }
                playing.scrollIntoView({
                    block: "center",
                    inline: "center",
                    behavior: "smooth"
                });
            }
        }
    }, [lyric]);

    // effects
    React.useEffect(() => {
        setIsLoading(true);
        getlyric(songId).then(() => setIsLoading(false));
    }, [songId]);

    React.useEffect(() => {
        lyricJs.current = lyric.toJS();
    }, [lyric]);

    React.useEffect(() => {
        // registery audio
        audio.addEventListener("timeupdate", handler);
        return () => {
            audio.removeEventListener("timeupdate", handler);
        };
    }, []);

    // renders
    if (isLoading) {
        return (
            <div className={`${className} lc-container`}>
                <Loader show />
            </div>
        );
    }
    return (
        <div className={`${className} lc-container`}>
            <aside className="lc-lyrics">
                <section
                    onWheel={e => {
                        e.currentTarget.setAttribute("scrolling", "true");
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.removeAttribute("scrolling");
                    }}
                >
                    <div className="lc">{renderLyrics(lyric.toJS())}</div>
                </section>
            </aside>
        </div>
    );
};

export default LyricComponent;
