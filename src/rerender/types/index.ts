export interface TSong {
    id: number;
    name: string;
    artists: {
        id: number;
        name: string;
    }[];
    album: { id: number; name: string };
    duration: number;
}
