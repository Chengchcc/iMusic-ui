/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useSelector } from "react-redux";
import { createAction } from "../../util/aciton";
import store from "../../reducers";
import VolumeController from "../../components/VolumeController";
import PlayList from "../../components/playlist";
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

const readableSecond = (secondValue: number) => {
    if (isNaN(secondValue)) {
        return "0:00";
    }
    const hours = Math.floor(secondValue / 60 / 60);
    const minutes = Math.floor(secondValue / 60) % 60;
    const seconds = Math.floor(secondValue - hours * 60 * 60 - minutes * 60);
    const secondss =
        seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    if (hours) {
        return hours.toString() + ":" + minutes.toString() + ":" + secondss;
    }
    return minutes.toString() + ":" + secondss;
};

const mockSong = {
    thumb_url:
        "http://p2.music.126.net/CQ81XHWrE9EgHdKs0ysIBQ==/109951164428167647.jpg",
    name: "Yummy",
    artist: "justin Bieber",
    duration: 182
};

const Playerbar = () => {
    // selectors
    const mode = useSelector((state: any) => state.get("playlist").get("mode"));
    const playing = useSelector((state: any) =>
        state.get("playlist").get("playing")
    );
    // TODO remove
    const { duration } = mockSong;
    // state
    const [showSound, setShowSound] = React.useState(false);
    const [showPlayList, setShowPlayList] = React.useState(false);

    // refs
    const timeLineRef = React.useRef<HTMLDivElement>(null);
    const progressBarRef = React.useRef<HTMLDivElement>(null);
    const playedRef = React.useRef<HTMLDivElement>(null);
    const cursorRef = React.useRef<HTMLDivElement>(null);
    const timePlayedRef = React.useRef<HTMLDivElement>(null);

    // handlers
    const progressMousedownHandler = (e: MouseEvent) => {
        const maxWidth =
            progressBarRef.current!.offsetWidth -
            cursorRef.current!.offsetWidth;
        const offsetLeft =
            progressBarRef.current!.offsetLeft +
            timeLineRef.current!.offsetLeft;
        let reviseWidth =
            e.clientX - offsetLeft - cursorRef.current!.offsetWidth / 2;
        let reviseProgressValue;
        if (reviseWidth > maxWidth) {
            reviseProgressValue = 1;
        } else if (reviseWidth < 0) {
            reviseProgressValue = 0;
        } else {
            reviseProgressValue = reviseWidth / maxWidth;
        }

        timePlayedRef.current!.innerText = readableSecond(
            duration * reviseProgressValue
        );

        playedRef.current!.setAttribute(
            "style",
            "width:calc(" +
                reviseProgressValue +
                " * (100% - " +
                cursorRef.current!.offsetWidth +
                "px))"
        );

        document.onmousemove = e1 => {
            reviseWidth =
                e1.clientX - offsetLeft - cursorRef.current!.offsetWidth / 2;
            if (reviseWidth > maxWidth) {
                reviseProgressValue = 1;
            } else if (reviseWidth < 0) {
                reviseProgressValue = 0;
            } else {
                reviseProgressValue = reviseWidth / maxWidth;
            }
            timePlayedRef.current!.innerText = readableSecond(
                duration * reviseProgressValue
            );
            playedRef.current!.setAttribute(
                "style",
                "width:calc(" +
                    reviseProgressValue +
                    " * (100% - " +
                    cursorRef.current!.offsetWidth +
                    "px))"
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
        progressBarRef.current?.addEventListener(
            "mousedown",
            progressMousedownHandler
        );
        return () => {
            progressBarRef.current?.removeEventListener(
                "mousedown",
                progressMousedownHandler
            );
        };
    });

    React.useEffect(() => {
        (document.getElementsByClassName(
            "cover"
        )[0] as HTMLDivElement).setAttribute(
            "style",
            `background-image: url(${mockSong.thumb_url})`
        );
    }, [mockSong]);

    // render
    return (
        <div className="player-container">
            <div className="mediainfo">
                <div
                    className="cover"
                    style={{ backgroundImage: `url(${mockSong.thumb_url})` }}
                ></div>
                {
                    //@ts-ignore
                    <a className="song" name={mockSong.name}></a>
                }
                {
                    //@ts-ignore
                    <a className="related" artist={mockSong.artist}></a>
                }
            </div>
            <div className="timeline" ref={timeLineRef}>
                <div className="time played" ref={timePlayedRef}>
                    0:00
                </div>
                <div className="progressbar" ref={progressBarRef}>
                    <div className="filler played" ref={playedRef} />
                    <div className="cursor" ref={cursorRef} />
                    <div className="filler unplayed" />
                </div>
                <div className="time total">{readableSecond(duration)}</div>
            </div>
            <div className="controller">
                {showSound ? (
                    <VolumeController hide={() => setShowSound(false)} />
                ) : null}
                <button
                    className="sound"
                    title="sound"
                    onClick={() => setShowSound(true)}
                />
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
                <button
                    className="list"
                    title="list"
                    onClick={() => setShowPlayList(true)}
                />
                {showPlayList ? (
                    <PlayList hide={() => setShowPlayList(false)} />
                ) : null}
            </div>
        </div>
    );
};

export default Playerbar;
