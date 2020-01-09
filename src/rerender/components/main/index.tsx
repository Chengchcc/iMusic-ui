import React from "react";
import "./style.less";
interface Props {
    className?: string;
}
const Main: React.FC<Props> = props => (
    <div className={`main ${props.className || ""}`}>{props.children}</div>
);

export default Main;
