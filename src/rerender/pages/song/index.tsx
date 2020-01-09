import React from "react";
import { useParams } from "react-router-dom";

const Song: React.FC = () => {
    const { id } = useParams();
    return <>{`Song ${id}`}</>;
};

export default Song;
