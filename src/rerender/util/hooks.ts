import { useLocation } from "react-router-dom";

export function useQuery() {
    const search = useLocation().search;
    return new URLSearchParams(search);
}
