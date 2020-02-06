import React, { ReactNode } from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader";
import store from "../../../reducers";
import { createAction } from "../../../util/aciton";
import { chunk } from "../../../util";
import Pagination from "../../../components/pagination";
import { getPlaylistDetail } from "../../../services";
import { TSong } from "../../../types";
import ColumGroup from "../../../components/columGroup";

interface Props {
    keywords: string;
}

const SearchPlaylist: React.FC<Props> = props => {
    const { keywords } = props;
    const isActive = usePanelState();
    const isLoading = useSelector((state: any) =>
        state.get("search").get("isLoading")
    );
    const playlistIMM = useSelector((state: any) =>
        state.get("search").get("playlists")
    );
    const playlists: any[] = playlistIMM.toJS();
    const currentPage = (store.getState() as any)
        .get("search")
        .get("playlistsCurrentPage");
    const totalPage = (store.getState() as any)
        .get("search")
        .get("playlistsTotalPage");
    // handlers
    const toPage = React.useCallback(
        (page: number) => {
            store.dispatch(
                createAction("search/getplaylists")({
                    keywords,
                    page
                })
            );
        },
        [keywords]
    );
    // effects
    React.useEffect(() => {
        if (isActive && keywords) {
            store.dispatch(
                createAction("search/getplaylists")({ keywords, page: 1 })
            );
        }
    }, [keywords, isActive]);

    React.useEffect(() => {
        const anodes = document?.querySelectorAll(".advanced-container>span");
        const reg = keywords.replace(/[-/^$*+?.()|[]{}]/g, "$&");
        anodes?.forEach(node => {
            const text = node.innerHTML;
            const findText = text.split(reg);
            node.innerHTML = findText.join(
                `<span style="color:#278AD6;">${reg}</span>`
            );
        });
    });

    // renders
    const cols: ReactNode[] = [];
    const artistsChunks = chunk(playlists, 4);
    artistsChunks.forEach((chk, idx) => {
        cols.push(
            <ColumGroup
                key={idx + ""}
                data={chk}
                renderData={el => (
                    <div className="advanced-container">
                        <div
                            className="thumb-img"
                            style={{ backgroundImage: `url(${el.cover})` }}
                        />
                        <span>{el.name}</span>
                    </div>
                )}
                getDetail={(id, callback) => {
                    getPlaylistDetail(id).then(data => callback(parser(data)));
                }}
            />
        );
    });
    return (
        <div className={isActive ? "panel" : "panel hide"}>
            {isLoading && <Loader show />}
            {!isLoading && playlists.length > 0 && (
                <>
                    <div className="advanced-res">{cols}</div>
                    <Pagination
                        currentPage={currentPage}
                        className="pagination"
                        totalPage={totalPage}
                        onPageClick={toPage}
                    />
                </>
            )}
        </div>
    );
};

export default SearchPlaylist;

// parser

const parser = (org: any) => {
    console.log("org=>", org);
    const songs: any[] = org.playlist.tracks;
    const _songs: TSong[] = [];
    songs.forEach(song => {
        _songs.push({
            id: song.id,
            name: song.name,
            artists: song.ar,
            album: song.al,
            duration: song.dt
        });
    });
    return {
        cover: org.playlist.coverImgUrl,
        songs: _songs
    };
};
