import React from "react";
import { usePanelState } from "../../../../components/tabs/hooks";
import { useSelector } from "react-redux";
import Loader from "../../../../components/loader";
import store from "../../../../reducers";
import { createAction } from "../../../../util/aciton";

interface Props {
    keywords: string;
}

const SearchAlbum: React.FC<Props> = props => {
    const { keywords } = props;
    const isActive = usePanelState();
    const isLoading = useSelector((state: any) =>
        state.get("search").get("isLoading")
    );

    // effects
    React.useEffect(() => {
        if (isActive && keywords) {
            store.dispatch(
                createAction("search/getalbums")({ keywords, page: 1 })
            );
        }
    }, [keywords]);

    return (
        <div className={isActive ? "panel" : "panel hide"}>
            {isLoading && <Loader show />}
            album
        </div>
    );
};

export default SearchAlbum;
