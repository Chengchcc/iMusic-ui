import React, { ReactNode } from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader";
import store from "../../../reducers";
import { createAction } from "../../../util/aciton";
import ColumGroup from "../component/columGroup";
import { chunk } from "../../../util";
import { getArtistDetail } from "../../../services";
import Pagination from "../../../components/pagination";
import { TSong } from "../../../types";
import "./style.less";
interface Props {
    keywords: string;
}

const SearchArtist: React.FC<Props> = props => {
    const { keywords } = props;
    const isActive = usePanelState();
    const isLoading = useSelector((state: any) =>
        state.get("search").get("isLoading")
    );
    const artistsIMM = useSelector((state: any) =>
        state.get("search").get("artists")
    );
    const artists: any[] = artistsIMM.toJS();
    const currentPage = (store.getState() as any)
        .get("search")
        .get("artistsCurrentPage");
    const totalPage = (store.getState() as any)
        .get("search")
        .get("artistsTotalPage");
    // handlers
    const toPage = React.useCallback(
        (page: number) => {
            store.dispatch(
                createAction("search/getartists")({
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
                createAction("search/getartists")({ keywords, page: 1 })
            );
        }
    }, [keywords, isActive]);

    React.useEffect(() => {
        const anodes = document?.querySelectorAll(".artist-container>span");
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
    const artistsChunks = chunk(artists, 4);
    artistsChunks.forEach((chk, idx) => {
        cols.push(
            <ColumGroup
                key={idx + ""}
                data={chk}
                renderData={el => (
                    <div className="artist-container">
                        <div
                            className="thumb-img"
                            style={{ backgroundImage: `url(${el.avatar})` }}
                        />
                        <span>{el.name}</span>
                    </div>
                )}
                getDetail={(id, callback) => {
                    getArtistDetail(id).then(data => callback(parser(data)));
                }}
            />
        );
    });

    return (
        <div className={isActive ? "panel" : "panel hide"}>
            {isLoading && <Loader show />}
            {!isLoading && artists.length > 0 && (
                <>
                    <div className="artists-res">{cols}</div>
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

export default SearchArtist;

// parser

const parser = (org: any) => {
    const artist = org.artist;
    const songs: any[] = org.hotSongs;
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
        cover: artist.picUrl,
        songs: _songs
    };
};
