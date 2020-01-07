/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useSelector } from "react-redux";
import { createAction } from "../../util/aciton";
import store from "../../reducers";
import VolumeController from "./component/volumeController";
import PlayList from "./component/playlist";
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
    album: "123",
    duration: 182
};

// handlers
const extendsHandler = (cb?: () => any) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof cb === "function") cb();
    const el = document.getElementsByClassName(
        "player-container"
    )[0]! as HTMLDivElement;
    el.setAttribute("class", "player-container extend");
};

const hideHandler = (cb?: (...arg: any[]) => any) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof cb === "function") cb();
    const els = document.getElementsByClassName("player-container extend");
    if (els.length === 0) return;
    const el = els[0] as HTMLDivElement;
    el.setAttribute("class", "player-container");
};

const toSong = (..._args: any[]) => (e: React.MouseEvent) => {
    // TODO
    hideHandler()(e);
    console.log("toSong");
};

const toArtist = (..._args: any[]) => (e: React.MouseEvent) => {
    // TODO
    hideHandler()(e);
    console.log("toArtist");
};

const toAlbum = (..._args: any[]) => (e: React.MouseEvent) => {
    // TODO
    hideHandler()(e);
    console.log("toAlbum");
};

// views
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
            <>
                <div className="mediainfo" onClick={extendsHandler()}>
                    <div
                        className={!playing ? "cover" : "cover pause"}
                        style={{
                            backgroundImage: `url(${mockSong.thumb_url}) no-repeat`
                        }}
                    ></div>
                    <div className="song">
                        <i>单曲:</i>{" "}
                        <a className="link" onClick={toSong()}>
                            {mockSong.name}
                        </a>
                    </div>
                    <div className="artist">
                        <i>歌手: </i>{" "}
                        <a className="link" onClick={toArtist()}>
                            {mockSong.artist}
                        </a>
                    </div>
                    <div className="album">
                        <i>专辑: </i>{" "}
                        <a className="link" onClick={toAlbum()}>
                            {mockSong.album}
                        </a>
                    </div>
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
                <div className="song-controller">
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
                    <button className="download" title="download" />
                    <button
                        className="list"
                        title="list"
                        onClick={() => setShowPlayList(true)}
                    />
                    {showPlayList ? (
                        <PlayList hide={() => setShowPlayList(false)} />
                    ) : null}
                </div>
                <div className="drag">
                    <button className="fold" onClick={hideHandler()} />
                </div>
            </>
        </div>
    );
};

export default Playerbar;
