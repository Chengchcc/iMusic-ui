import React from "react";
import { useParams } from "react-router-dom";

const Artist: React.FC = () => {
    const { id } = useParams();
    return <>{`Artist:${id}`}</>;
};

export default Artist;
