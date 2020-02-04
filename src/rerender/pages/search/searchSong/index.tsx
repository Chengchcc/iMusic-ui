/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import store from "../../../reducers";
import { createAction } from "../../../util/aciton";
import Loader from "../../../components/loader";
import Pagination from "../../../components/pagination";
import SongComponent from "../../../components/songComponent";
import "./style.less";

interface Props {
    keywords: string;
}
const SearchSong: React.FC<Props> = props => {
    // selectors
    const { keywords } = props;
    const isActive = usePanelState();
    const isLoading = useSelector((state: any) =>
        state.get("search").get("isLoading")
    );
    const songsIMM = useSelector((state: any) =>
        state.get("search").get("songs")
    );
    const songs: any[] = songsIMM.toJS();
    const currentPage = (store.getState() as any)
        .get("search")
        .get("songsCurrentPage");
    const totalPage = (store.getState() as any)
        .get("search")
        .get("songsTotalPage");
    // handlers
    const toPage = React.useCallback(
        (page: number) => {
            store.dispatch(
                createAction("search/getsongs")({
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
                createAction("search/getsongs")({ keywords, page: 1 })
            );
        }
    }, [keywords, isActive]);

    React.useEffect(() => {
        const resBox = document.getElementById("song-res");
        const anodes = resBox?.querySelectorAll("a");
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
    const songViews = songs.map(song => (
        <SongComponent key={song.id + ""} {...song} />
    ));

    return (
        <div className={isActive ? "panel" : "panel hide"}>
            {isLoading && <Loader show />}
            {!isLoading && songs.length > 0 && (
                <>
                    <div className="song-res" id="song-res">
                        <table>
                            <tbody>{songViews}</tbody>
                        </table>
                    </div>
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

export default SearchSong;
