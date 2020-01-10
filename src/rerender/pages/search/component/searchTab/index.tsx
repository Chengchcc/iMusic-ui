import React from "react";
import { useTabState } from "../../../../components/tabs/hooks";

interface Props {
    title: string;
    onClick: () => any;
}

const SearchTab: React.FC<Props> = props => {
    const { title, onClick } = props;
    const { onClick: setActive, isActive } = useTabState();
    return (
        <li className={isActive ? "active" : ""}>
            <a
                onClick={() => {
                    onClick();
                    setActive();
                }}
            >
                {title}
            </a>
        </li>
    );
};

export default SearchTab;
