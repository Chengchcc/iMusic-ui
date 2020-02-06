import React from "react";
import { useTabState } from "../../../../components/tabs/hooks";

interface Props {
    title: string;
}

const PageTab: React.FC<Props> = props => {
    const { title } = props;
    const { onClick: setActive, isActive } = useTabState();
    return (
        <li className={isActive ? "active" : ""}>
            <a
                onClick={() => {
                    setActive();
                }}
            >
                {title}
            </a>
        </li>
    );
};

export default PageTab;
