import * as React from "react";
import "./style.less";

interface IndicatorProps {
    className?: string;
    style?: any;
}

const Indicator: React.SFC<IndicatorProps> = props => {
    const { className, style } = props;
    return (
        <div className={`indicator-container ${className}`} style={style}>
            <span />
            <span />
            <span />
            <span />
        </div>
    );
};

export default Indicator;
