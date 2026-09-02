import {
  ArrowDownward,
  ArrowRightAlt,
  ArrowUpward,
} from "@mui/icons-material";
import type { ClientResponseDto } from "./client";
import type { UserResponseDto } from "./user";

export const RequestStatus = {
  UNASSIGNED: 1,
  IN_PROGRESS: 2,
  DONE: 3,
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const RequestPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export type RequestPriority =
  (typeof RequestPriority)[keyof typeof RequestPriority];

export type RequestCreateDto = {
  clientId: number;
  createdByUserId: number;
  title: string;
  description: string;
  priority?: RequestPriority;
};

export type RequestResponseDto = {
  id: number;
  clientId: number;
  client: ClientResponseDto | null;
  createdByUserId: number;
  createdByUser: UserResponseDto;
  assignedToUserId: number | null;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  internal: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type RequestNoteResponseDto = {
  id: number;
  requestId: number;
  createdByUserId: number;
  createdByUser: UserResponseDto;
  content: string;
  createdAt: string;
  updatedAt: string | null;
};

export const REQUEST_STATUS_META: Record<
  RequestStatus,
  { label: string; color: string }
> = {
  [RequestStatus.UNASSIGNED]: { label: "Unassigned", color: "#9ca3af" },
  [RequestStatus.IN_PROGRESS]: { label: "In Progress", color: "#3b82f6" },
  [RequestStatus.DONE]: { label: "Done", color: "#22c55e" },
};

export const REQUEST_PRIORITY_META: Record<
  RequestPriority,
  {
    label: string;
    color: string;
    textColor: string;
    icon: typeof ArrowDownward;
  }
> = {
  [RequestPriority.LOW]: {
    label: "Low",
    color: "#22c55e",
    textColor: "#ffffff",
    icon: ArrowDownward,
  },
  [RequestPriority.MEDIUM]: {
    label: "Medium",
    color: "#f59e0b",
    textColor: "#111827",
    icon: ArrowRightAlt,
  },
  [RequestPriority.HIGH]: {
    label: "High",
    color: "#ef4444",
    textColor: "#ffffff",
    icon: ArrowUpward,
  },
};
