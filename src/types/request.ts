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
  CRITICAL: 4,
} as const;

export type RequestPriority =
  (typeof RequestPriority)[keyof typeof RequestPriority];

export type RequestResponseDto = {
  id: number;
  clientId: number;
  createdByUserId: number;
  assignedToUserId: number | null;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  internal: boolean;
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
