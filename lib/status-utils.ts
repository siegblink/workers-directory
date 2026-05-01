export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    accepted: "Upcoming",
    in_progress: "In Progress",
    completed: "Completed",
    canceled: "Cancelled",
  };
  return labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    accepted:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    in_progress:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] ?? "bg-secondary text-foreground";
}
