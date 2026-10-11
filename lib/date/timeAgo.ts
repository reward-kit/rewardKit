export function timeAgo(input: string | number): string {
  let timestamp: number;
  if (!input) return "—";

  if (typeof input === "string") {
    timestamp = new Date(input).getTime();
  } else {
    timestamp = input * 1000; // unix seconds → ms
  }

  const diff = Date.now() - timestamp;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}