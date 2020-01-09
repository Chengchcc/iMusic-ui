import React from "react";
import { useParams } from "react-router-dom";

const Album: React.FC = () => {
    const { id } = useParams();
    return <>{`Album ${id}`}</>;
};

export default Album;
