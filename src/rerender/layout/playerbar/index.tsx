/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useSelector } from "react-redux";
import { createAction } from "../../util/aciton";
import store from "../../reducers";
import VolumeController from "./component/volumeController";
import LyricComponent from "./component/lyric";
import PlayList from "./component/playlist";
import { useHistory } from "react-router-dom";
import { audio } from "../audioplayer";
import { readableSecond } from "../../util";
// @ts-ignore
import ColorThief from "colorthief";
import Colors from "../../util/colors";
import "./style.less";
import { getAlbumDetail } from "../../services";

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

// views
const Playerbar = () => {
    // history
    const history = useHistory();

    // selectors
    const mode = useSelector((state: any) => state.get("playlist").get("mode"));
    const playing = useSelector((state: any) =>
        state.get("playlist").get("playing")
    );

    const curentSong = useSelector((state: any) =>
        state.get("playlist").get("currentSong")
    );

    const { duration, name, artists = [], album = { id: "" }, id } = curentSong
        ? curentSong.toJS()
        : ({} as any);
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
        let reviseProgressValue: number;
        if (reviseWidth > maxWidth) {
            reviseProgressValue = 1;
        } else if (reviseWidth < 0) {
            reviseProgressValue = 0;
        } else {
            reviseProgressValue = reviseWidth / maxWidth;
        }

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
            handleProgress(reviseProgressValue);
        };

        document.onmouseup = () => {
            // update player
            setProgress(reviseProgressValue);
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    const handleProgress = (reviseProgressValue: number) => {
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

    const setProgress = (progressValue: number) => {
        const expectTime = audio.duration * progressValue;
        if (audio.seekable.length != 0) {
            for (let x = 0; x < audio.seekable.length; x++) {
                if (
                    expectTime >= audio.seekable.start(x) &&
                    expectTime <= audio.seekable.end(x)
                ) {
                    audio.currentTime = expectTime;
                    return;
                }
            }
            audio.currentTime = audio.buffered.end(audio.buffered.length - 1);
        }
    };

    const toSong = React.useCallback(
        (id: number) => (e: React.MouseEvent) => {
            hideHandler()(e);
            history.push(`/song:${id}`);
        },
        []
    );

    const toArtist = React.useCallback(
        (id: number) => (e: React.MouseEvent) => {
            hideHandler()(e);
            history.push(`/artist:${id}`);
        },
        []
    );

    const toAlbum = React.useCallback(
        (id: number) => (e: React.MouseEvent) => {
            hideHandler()(e);
            history.push(`/album:${id}`);
        },
        []
    );

    const nextSong = () => {
        store.dispatch(createAction("playlist/next")());
    };
    const previousSong = () => {
        store.dispatch(createAction("playlist/previous")());
    };

    // effects
    React.useEffect(() => {
        const handler = () => {
            handleProgress((audio.currentTime * 1000) / duration);
        };
        audio.addEventListener("timeupdate", handler);
        progressBarRef.current?.addEventListener(
            "mousedown",
            progressMousedownHandler
        );
        return () => {
            progressBarRef.current?.removeEventListener(
                "mousedown",
                progressMousedownHandler
            );
            audio.removeEventListener("timeupdate", handler);
        };
    });
    React.useEffect(() => {
        // get album pic
        if (album.id) {
            getAlbumDetail(album.id).then((data: any) => {
                const { album: { picUrl } = { picUrl: "" } } = data;
                const img = new Image();
                img.setAttribute("crossOrigin", "");
                img.addEventListener("load", () => {
                    const colorThief = new ColorThief();
                    const rgbColor = colorThief.getColor(img);
                    const cover = document.getElementsByClassName(
                        "cover"
                    )[0] as HTMLDivElement;
                    const bgblur = document.getElementsByClassName(
                        "bgblur"
                    )[0] as HTMLDivElement;
                    const playBar = document.getElementsByClassName(
                        "player-container"
                    )[0] as HTMLDivElement;
                    const titleBar = document.getElementsByClassName(
                        "title-container"
                    )[0] as HTMLDivElement;
                    const sideBar = document.getElementsByClassName(
                        "sidebar"
                    )[0] as HTMLDivElement;
                    cover.style.backgroundImage = "url(" + picUrl + ")";
                    bgblur.style.backgroundImage =
                        "-webkit-linear-gradient(90deg, rgba(" +
                        rgbColor +
                        ",0.6), rgba(255, 255, 255, 0),rgba(" +
                        rgbColor +
                        ",0.3)),url(" +
                        picUrl +
                        ")";
                    const maincolor = Colors.randomColor();
                    playBar.style.backgroundColor = maincolor;
                    titleBar.style.backgroundColor = maincolor;
                    sideBar.style.backgroundColor = maincolor;
                });
                img.src = picUrl;
            });
        }
    }, [album.id]);

    // render
    const artistsViews: any[] = [];
    artists.forEach((artist: any) => {
        artistsViews.push("/");
        artistsViews.push(
            <a
                className="link"
                key={artist.id + ""}
                onClick={toArtist(artist.id)}
            >
                {artist.name}
            </a>
        );
    });
    return (
        <div className="player-container">
            <>
                <div className="bgblur" />
                <div className="mediainfo" onClick={extendsHandler()}>
                    <div className={playing ? "cover" : "cover pause"}></div>
                    <div className="song">
                        <i>单曲: </i>
                        <a className="link" onClick={toSong(id)}>
                            {name}
                        </a>
                    </div>
                    <div className="artist">
                        <i>歌手: </i>
                        {artistsViews.slice(1)}
                    </div>
                    <div className="album">
                        <i>专辑: </i>
                        <a className="link" onClick={toAlbum(album.id)}>
                            {album.name}
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
                    <button
                        className="previous"
                        title="previous"
                        onClick={previousSong}
                    />
                    <button
                        className={playing ? "pause" : "play"}
                        onClick={() => playSong(!playing)}
                        title={playing ? "pause" : "play"}
                    />
                    <button className="next" title="next" onClick={nextSong} />
                    <button
                        className={`${getMode(mode)}`}
                        onClick={() => swithMode(mode)}
                        title={`${getMode(mode)}`}
                    />
                    <button
                        className="sound"
                        title="sound"
                        onClick={() => setShowSound(true)}
                    />
                    {showSound ? (
                        <VolumeController hide={() => setShowSound(false)} />
                    ) : null}
                </div>
                <div className="controller">
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
                <LyricComponent songId={id} className="lyric" />
            </>
        </div>
    );
};

export default Playerbar;
