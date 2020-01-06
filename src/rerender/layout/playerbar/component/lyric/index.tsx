import React from "react";

interface Props {
    songId: number;
}

const LyricComponent: React.FC<Props> = props => {
    return <div className="lyric"></div>;
};

export default LyricComponent;
