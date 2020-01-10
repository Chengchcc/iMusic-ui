import React from "react";
import { usePanelState } from "../../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import store from "../../../../reducers";
import { createAction } from "../../../../util/aciton";
import Loader from "../../../../components/loader";
import Pagination from "../../../../components/pagination";

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
    console.log("songs=>", songs);
    const currentPage = (store.getState() as any)
        .get("search")
        .get("songsCurrentPage");
    const totalPage = (store.getState() as any)
        .get("search")
        .get("songsTotalPage");
    // handlers
    const toPage = (page: number) => {
        store.dispatch(
            createAction("search/getsongs")({
                keywords,
                page
            })
        );
    };

    // effects
    React.useEffect(() => {
        if (isActive && keywords) {
            store.dispatch(
                createAction("search/getsongs")({ keywords, page: 0 })
            );
        }
    }, [keywords]);

    // renders
    return (
        <div className={isActive ? "panel" : "panel hide"}>
            {isLoading && <Loader show />}
            {!isLoading && songs.length > 0 && (
                <>
                    <ul></ul>
                    <Pagination
                        className="pagination"
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onPageClick={toPage}
                        prePageClick={() => toPage(currentPage - 1)}
                        nextPageClick={() => toPage(currentPage + 1)}
                    />
                </>
            )}
        </div>
    );
};

export default SearchSong;
