import { Plan } from "./types";

export const plans: Record<
  Plan,
  {
    name: string;
    workspaceLimit: number;
    projectLimit: number;
    roomLimit: number;
    durationInDays: number;
  }
> = {
  Free: {
    name: "Free",
    workspaceLimit: 1,
    projectLimit: 3,
    roomLimit: 1,
    durationInDays: Infinity,
  },
  Pro: {
    name: "Pro",
    workspaceLimit: 5,
    projectLimit: 20,
    roomLimit: 5,
    durationInDays: 30,
  },
  Enterprise: {
    name: "Enterprise",
    workspaceLimit: Infinity,
    projectLimit: Infinity,
    roomLimit: 10,
    durationInDays: 30,
  },
};
