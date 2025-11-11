import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { PrStatus } from "../types";

export const usePrFilter = () => {
    return useQueryStates({
        status: parseAsStringEnum(Object.values(PrStatus)),
        search: parseAsString,
    });
};
