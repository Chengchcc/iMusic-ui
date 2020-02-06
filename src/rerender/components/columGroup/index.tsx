/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { createAction } from "../../util/aciton";
import { TSong } from "../../types";
import SongComponent from "../songComponent";
import Loader from "../loader";
import "./style.less";

interface Props<T> {
    data: T[];
    renderData: (el: T) => React.ReactNode;
    getDetail: (id: number, callback: (data: any) => void) => void;
}
const COL_NUM = 4;
const ColumGroup: React.FC<Props<any>> = props => {
    const { data, renderData, getDetail } = props;
    const refDetail = React.useRef<HTMLDivElement>(null);
    const [detail, setDetail] = React.useState<any>({});
    const dispatch = useDispatch();
    if (data.length > COL_NUM) {
        console.warn(
            `data length require lte ${COL_NUM}. current is  ${data.length}`
        );
    }
    const cols: React.ReactNode[] = [];

    // handles
    const playAll = React.useCallback(() => {
        dispatch(
            createAction("playlist/playall")({
                songs: detail.songs
            })
        );
    }, [detail]);
    // renders
    for (let i = 0; i < Math.min(data.length, COL_NUM); i++) {
        cols.push(
            <div
                key={"col" + i}
                className="col-t"
                onClick={e => {
                    e.stopPropagation();
                    const details = document.querySelectorAll(
                        ".advanced-res>.col-detail"
                    );
                    // reset
                    setDetail({});
                    details.forEach(det => {
                        det.className = classNameGen(0);
                    });
                    refDetail.current!.className = classNameGen(
                        (i % COL_NUM) + 1
                    );
                    // request
                    getDetail(data[i].id, dat => setDetail(dat));
                }}
            >
                {renderData(data[i])}
            </div>
        );
    }
    const songsLi: ReactNode[] = [];
    if (detail.songs) {
        detail.songs.forEach((el: TSong, idx: number) => {
            songsLi.push(<SongComponent {...el} key={idx} />);
        });
    }
    cols.push(
        <div className={classNameGen(0)} ref={refDetail} key={"detail"}>
            <div className="point" />
            <div className="col-detail-container">
                {!detail.songs ? (
                    <Loader />
                ) : (
                    <>
                        <div
                            className="col-detail-cover"
                            style={{ backgroundImage: `url(${detail.cover})` }}
                        />
                        <div
                            className="button-play-all"
                            title={"播放全部"}
                            onClick={playAll}
                        />
                        <div className="col-detail-songs">
                            <table>
                                <tbody>{songsLi}</tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return <>{cols}</>;
};

const classNameGen = (i: number) => {
    switch (i) {
        case 0:
            return "col-detail hide";
        case 1:
            return "col-detail first";
        case 2:
            return "col-detail second";
        case 3:
            return "col-detail third";
        case 4:
            return "col-detail fourth";
        default:
            return "";
    }
};

export default ColumGroup;
