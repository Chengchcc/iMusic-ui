import React from "react";
import { usePanelState } from "../../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import store from "../../../../reducers";
import { createAction } from "../../../../util/aciton";
import Loader from "../../../../components/loader";

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
    const songs = useSelector((state: any) => state.get("search").get("songs"));
    const currentPage = (store.getState() as any)
        .get("search")
        .get("songsCurrentPage");
    const totalPage = (store.getState() as any)
        .get("search")
        .get("songsTotalPage");
    // handles
    const nextPage = React.useCallback(() => {
        store.dispatch(
            createAction("search/getsongs")({ keywords, page: currentPage + 1 })
        );
    }, [currentPage]);

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
            {!isLoading && (
                <>
                    <ul></ul>
                </>
            )}
        </div>
    );
};

export default SearchSong;
