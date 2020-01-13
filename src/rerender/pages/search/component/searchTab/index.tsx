import React from "react";
import { useTabState } from "../../../../components/tabs/hooks";

interface Props {
    title: string;
    onClick: (i: number) => any;
}

const SearchTab: React.FC<Props> = props => {
    const { title, onClick } = props;
    const { onClick: setActive, isActive, tabIndex } = useTabState();
    return (
        <li className={isActive ? "active" : ""}>
            <a
                onClick={() => {
                    onClick(tabIndex);
                    setActive();
                }}
            >
                {title}
            </a>
        </li>
    );
};

export default SearchTab;
