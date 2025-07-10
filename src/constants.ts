import {
  LogsIcon,
  User2Icon,
  CircleDashedIcon,
  CircleIcon,
  X,
} from "lucide-react";

export const SIDEBAR_DATA = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: User2Icon,
    },
    {
      title: "Audit logs",
      url: "/audit-logs",
      icon: LogsIcon,
    },
  ],
};

export const statuses = [
  {
    value: "PENDING",
    label: "Pending",
    icon: CircleDashedIcon,
  },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CircleIcon,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: X,
  },
];

export const PAGE_KEY = "page";
export const PER_PAGE_KEY = "perPage";
export const THROTTLE_MS = 50;
export const parseAsIntegerOptions = {
  clearOnDefault: false,
  history: "push" as const,
  scroll: false,
  shallow: true,
  throttleMs: THROTTLE_MS,
};
