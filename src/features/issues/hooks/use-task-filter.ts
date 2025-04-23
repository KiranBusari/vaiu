import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { IssueStatus } from "../types";

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(IssueStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
