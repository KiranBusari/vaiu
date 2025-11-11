import { ListChecksIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { PrStatus } from "../types";
import { usePrFilter } from "../hooks/use-pr-filter";

export const PrDataFilters = () => {
    const [{ status, search }, setFilters] = usePrFilter();

    const [searchValue, setSearchValue] = useState(search ?? "");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters({ search: searchValue || null });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue, setFilters]);

    const onStatusChange = (value: string) => {
        setFilters({ status: value === "all" ? null : (value as PrStatus) });
    };

    return (
        <div className="flex flex-col gap-2 lg:flex-row">
            <div className="relative flex-1 lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search pull requests..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-8 pl-9"
                />
            </div>
            <Select
                defaultValue={status ?? undefined}
                onValueChange={(value) => onStatusChange(value)}
            >
                <SelectTrigger className="h-8 w-full lg:w-auto">
                    <div className="flex items-center pr-2">
                        <ListChecksIcon className="mr-2 size-4" />
                        <SelectValue placeholder="All status" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectSeparator />
                    {Object.entries(PrStatus).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                            {key
                                .replace("_", " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
