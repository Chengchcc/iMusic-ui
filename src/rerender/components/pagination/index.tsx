import React from "react";
import "./style.less";

export interface PaginationProps {
    totalPage: number;
    groupCount?: number;
    className?: string;
    currentPage: number;
    onPageClick: (page: number) => any;
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
    const {
        totalPage,
        groupCount = 5,
        onPageClick: goPage,
        currentPage,
        className
    } = props;
    const pages = [];
    let startPage = 1;
    if (currentPage >= groupCount) {
        startPage = currentPage - 2;
    }

    pages.push(
        <li
            className={currentPage === 1 ? "nomore" : ""}
            onClick={() => {
                if (currentPage - 1 === 0) {
                    return false;
                }
                goPage(currentPage - 1);
            }}
            key={0}
        >
            上一页
        </li>
    );
    if (totalPage <= 10) {
        /*总页码小于等于10时，全部显示出来*/
        for (let i = 1; i <= totalPage; i++) {
            pages.push(
                <li
                    key={i}
                    onClick={() => goPage(i)}
                    className={currentPage === i ? "activePage" : ""}
                >
                    {i}
                </li>
            );
        }
    } else {
        /*总页码大于10时，部分显示*/

        //第一页
        pages.push(
            <li
                className={currentPage === 1 ? "activePage" : ""}
                key={1}
                onClick={() => goPage(1)}
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
            if (i <= totalPage - 1 && i > 1) {
                pages.push(
                    <li
                        className={currentPage === i ? "activePage" : ""}
                        key={i}
                        onClick={() => goPage(i)}
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
                onClick={() => goPage(totalPage)}
            >
                {totalPage}
            </li>
        );
    }
    //下一页
    pages.push(
        <li
            className={currentPage === totalPage ? "nomore" : ""}
            onClick={() => {
                if (currentPage + 1 === 0) {
                    return false;
                }
                goPage(currentPage + 1);
            }}
            key={totalPage + 1}
        >
            下一页
        </li>
    );

    return <ul className={`page-container ${className || ""}`}>{pages}</ul>;
};
export default Pagination;
