import * as React from "react";
import colors from "../../util/colors";

import "./style.less";

interface LoaderProps {
    show?: boolean;
}

const Loader: React.SFC<LoaderProps> = ({ show = false }) => {
    if (!show) {
        return null;
    }
    return (
        <div className={"container show"}>
            <div className={"loader animationLoader"}>
                <span
                    onAnimationIteration={(e: any) => {
                        e.target.style.backgroundColor = colors.randomColor();
                    }}
                    className={"inner animationLoader"}
                />
            </div>
        </div>
    );
};

export default Loader;
