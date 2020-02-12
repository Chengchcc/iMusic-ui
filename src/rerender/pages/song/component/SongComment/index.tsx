import React from "react";
import { getSongCommnets } from "../../../../services";

interface Props {
    id: number;
}

interface TCommnets {
    user: any;
    contnet: string;
}
const SongCommnet: React.FC<Props> = props => {
    const { id } = props;
    const [comments, setCommnets] = React.useState<TCommnets[]>([]);
    React.useEffect(() => {
        if (id) {
            // TODO
            getSongCommnets(id).then(d => setCommnets(parser(d)));
        }
    }, [id]);

    return <div></div>;
};

export default SongCommnet;

// parser
const parser = (org: any): [TCommnets[], TCommnets[]] => {
    const comments_: any[] = org.comments;
    const hotCommnets_: any[] = org.hotCommnets;
    // comments_.forEach(co => {});
};
