import React, { ReactNode } from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader";
import store from "../../../reducers";
import { createAction } from "../../../util/aciton";
import { chunk } from "../../../util";
import { getAlbumDetail } from "../../../services";
import { TSong } from "../../../types";
import Pagination from "../../../components/pagination";
import ColumGroup from "../../../components/columGroup";

interface Props {
    keywords: string;
}

const SearchAlbum: React.FC<Props> = props => {
    const { keywords } = props;
    const isActive = usePanelState();
    const isLoading = useSelector((state: any) =>
        state.get("search").get("isLoading")
    );
    const albumsIMM = useSelector((state: any) =>
        state.get("search").get("albums")
    );
    const albums: any[] = albumsIMM.toJS();
    const currentPage = (store.getState() as any)
        .get("search")
        .get("albumsCurrentPage");
    const totalPage = (store.getState() as any)
        .get("search")
        .get("albumsTotalPage");
    // handlers
    const toPage = React.useCallback(
        (page: number) => {
            store.dispatch(
                createAction("search/getalbums")({
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
                createAction("search/getalbums")({ keywords, page: 1 })
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
    const albumsChunks = chunk(albums, 4);
    albumsChunks.forEach((chk, idx) => {
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
                    getAlbumDetail(id).then(data => callback(parser(data)));
                }}
            />
        );
    });
    return (
        <div className={isActive ? "panel" : "panel hide"}>
            {isLoading && <Loader show />}
            {!isLoading && albums.length > 0 && (
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

export default SearchAlbum;

// parser

const parser = (org: any) => {
    const album = org.album;
    const songs: any[] = org.songs;
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
        cover: album.picUrl,
        artist: album.artist,
        songs: _songs
    };
};
