import React from "react";
import "./style.less";

interface PaginationProps {
    currentPage: number;
    totalPage: number;
    groupCount?: number;
    startPage?: number;
    className?: string;
    prePageClick: () => any;
    nextPageClick: () => any;
    onPageClick: (page: number) => any;
}

const Pagination: React.FC<PaginationProps> = props => {
    const {
        currentPage,
        totalPage,
        prePageClick,
        groupCount = 5,
        nextPageClick,
        startPage = 0,
        onPageClick,
        className
    } = props;

    const pages = [];
    pages.push(
        <li
            className={currentPage === 0 ? "nomore" : ""}
            onClick={prePageClick}
            key={0}
        >
            上一页
        </li>
    );
    if (totalPage <= 10) {
        /*总页码小于等于10时，全部显示出来*/
        for (let i = 0; i <= totalPage; i++) {
            pages.push(
                <li
                    key={i + 1}
                    onClick={() => onPageClick(i)}
                    className={currentPage === i ? "activePage" : ""}
                >
                    {i + 1}
                </li>
            );
        }
    } else {
        /*总页码大于10时，部分显示*/

        //第一页
        pages.push(
            <li
                className={currentPage === 0 ? "activePage" : ""}
                key={1}
                onClick={() => onPageClick(0)}
            >
                1
            </li>
        );
        let pageLength = 0;
        if (groupCount + startPage > totalPage) {
            pageLength = totalPage;
        } else {
            pageLength = groupCount + startPage;
        }
        //前面省略号(当当前页码比分组的页码大时显示省略号)
        if (currentPage >= groupCount) {
            pages.push(
                <li className="" key={-1}>
                    ···
                </li>
            );
        }
        //非第一页和最后一页显示
        for (let i = startPage; i < pageLength; i++) {
            if (i <= totalPage - 1 && i > 0) {
                pages.push(
                    <li
                        className={currentPage === i ? "activePage" : ""}
                        key={i + 1}
                        onClick={() => onPageClick(i)}
                    >
                        {i}
                    </li>
                );
            }
        }
        //后面省略号
        if (totalPage - startPage >= groupCount + 1) {
            pages.push(
                <li className="" key={-2}>
                    ···
                </li>
            );
        }
        //最后一页
        pages.push(
            <li
                className={currentPage === totalPage ? "activePage" : ""}
                key={totalPage}
                onClick={() => onPageClick(totalPage)}
            >
                {totalPage}
            </li>
        );
    }
    //下一页
    pages.push(
        <li
            className={currentPage === totalPage ? "nomore" : ""}
            onClick={nextPageClick}
            key={totalPage + 1}
        >
            下一页
        </li>
    );

    return <ul className={`page-container ${className || ""}`}>{pages}</ul>;
};
export default Pagination;
